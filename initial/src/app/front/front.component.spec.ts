import { fakeAsync, TestBed } from '@angular/core/testing';
import { FrontComponent } from './front.component';
import { FrontService } from './front.service';

import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { RouterAdapterService } from '../_services/router-adapter/router-adapter.service';

describe('FrontComponent', () => {
  let componentUnderTest: FrontComponent;
  let actualResult: any;
  let frontServiceSpy: Spy<FrontService>;
  let routerSpy: Spy<RouterAdapterService>;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        FrontComponent,
        {
          provide: FrontService,
          useValue: createSpyFromClass(FrontService)
        },
        {
          provide: RouterAdapterService,
          useValue: createSpyFromClass(RouterAdapterService)
        }
      ]
    });

    componentUnderTest = TestBed.inject(FrontComponent);
    frontServiceSpy = TestBed.inject<any>(FrontService);
    routerSpy = TestBed.inject<any>(RouterAdapterService);
  });

  describe('INIT', () => {
    When(
      fakeAsync(() => {
        componentUnderTest.ngOnInit();
      })
    );

    describe('GIVEN there are llamas THEN store the result', () => {
      Given(() => {
        frontServiceSpy.getFeaturedLlamas
          .mustBeCalledWith({ newest: true })
          .resolveWith([{ id: 'FAKE ID', name: 'shai', imageFileName: 'fakeImage' }]);
      });

      Then(() => {
        expect(componentUnderTest.llamas.length).toBeGreaterThan(0);
      });
    });

    describe(`GIVEN there is a problem fetching the llamas
              THEN show an error`, () => {
      Given(() => {
        frontServiceSpy.getFeaturedLlamas.and.rejectWith();
      });

      Then(() => {
        expect(componentUnderTest.showErrorMessage).toBeTruthy();
      });
    });
  });

  describe('METHOD: isListVisible', () => {
    When(() => {
      actualResult = componentUnderTest.isListVisible();
    });

    describe('GIVEN there are llamas THEN return true', () => {
      Given(() => {
        componentUnderTest.llamas = [
          { id: 'FAKE ID', name: 'Billy', imageFileName: 'fakeImage.jpg' }
        ];
      });
      Then(() => {
        expect(actualResult).toEqual(true);
      });
    });

    describe('GIVEN there are no llamas THEN return false', () => {
      Given(() => {
        componentUnderTest.llamas = [];
      });
      Then(() => {
        expect(actualResult).toEqual(false);
      });
    });

    describe('GIVEN there is an error THEN return false', () => {
      Given(() => {
        componentUnderTest.showErrorMessage = true;
      });
      Then(() => {
        expect(actualResult).toEqual(false);
      });
    });
  });

  describe('METHOD: poke', () => {
    When(() => {
      componentUnderTest.poke(fakeLlama);
    });

    Then(() => {});
  });
});