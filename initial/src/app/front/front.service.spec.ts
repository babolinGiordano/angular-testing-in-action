import { FrontService } from './front.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { appRoutesName } from '../app.routes.names';
import { RouterAdapterService } from '../_services/router-adapter/router-adapter.service';

describe('FrontService', () => {
  let serviceUnderTest: FrontService;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;
  let routerAdapterServiceSpy: Spy<RouterAdapterService>;
  let fakeLlamas: Llama[];
  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        FrontService,
        { provide: LlamaRemoteService, useValue: createSpyFromClass(LlamaRemoteService) },
        {
          provide: RouterAdapterService,
          useValue: createSpyFromClass(RouterAdapterService)
        }
      ]
    });

    serviceUnderTest = TestBed.inject<any>(FrontService);
    llamaRemoteServiceSpy = TestBed.inject<any>(LlamaRemoteService);
    routerAdapterServiceSpy = TestBed.inject<any>(RouterAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
  });

  describe('METHOD: getFeaturedLlamas', () => {
    Given(() => {
      fakeLlamas = [{ id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
      llamaRemoteServiceSpy.getLlamasFromServer.and.nextOneTimeWith(fakeLlamas);
    });

    When(
      fakeAsync(async () => {
        actualResult = await serviceUnderTest.getFeaturedLlamas();
      })
    );

    Then(() => {
      expect(actualResult).toEqual(fakeLlamas);
    });
  });

  describe('METHOD: pokeLlama', () => {
    let fakeUserLlamaId: string;
    let fakeLlama: Llama;

    // Mutual code start
    When(() => {
      serviceUnderTest.pokeLlama(fakeLlama);
    });
    // Mutual code end

    describe('GIVEN user llama is empty THEN redirect to login', () => {
      Given(() => {
        serviceUnderTest.userLlama = null;
      });

      Then(() => {
        expect(routerAdapterServiceSpy.goToUrl).toHaveBeenCalledWith(
          `/${appRoutesName.LOGIN}`
        );
      });
    });

    describe('GIVEN user llama  exists', () => {
      Given(() => {
        serviceUnderTest.userLlama = createDefaultFakeLlama();
        fakeUserLlamaId = 'FAKE USER LLAMA ID';
        serviceUnderTest.userLlama.id = fakeUserLlamaId;
      });

      describe('GIVEN llama with an empty pokedBy list THEN add user llama to the list', () => {
        Given(() => {
          fakeLlama = createDefaultFakeLlama();
          fakeLlama.pokedByTheseLlamas = [];
        });

        Then(() => {
          const expectedChanges: Partial<Llama> = {
            pokedByTheseLlamas: [fakeUserLlamaId]
          };
          expect(llamaRemoteServiceSpy.update).toHaveBeenCalledWith(
            fakeLlama.id,
            expectedChanges
          );
        });
      });

      describe('GIVEN llama with a filled pokedBy list THEN add user llama to the list', () => {
        Given(() => {
          fakeLlama = createDefaultFakeLlama();
          fakeLlama.pokedByTheseLlamas = ['ANOTHER FAKE ID'];
        });

        Then(() => {
          const expectedChanges: Partial<Llama> = {
            pokedByTheseLlamas: ['ANOTHER FAKE ID', fakeUserLlamaId]
          };
          expect(llamaRemoteServiceSpy.update).toHaveBeenCalledWith(
            fakeLlama.id,
            expectedChanges
          );
        });
      });
    });
  });
});

function createDefaultFakeLlama(): Llama {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
