import { HttpAdapterService } from './http-adapter.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import serverMock from 'xhr-mock';
import { HttpClientModule } from '@angular/common/http';

describe('HttpAdapterService', () => {
  let serviceUnderTest: HttpAdapterService;

  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpAdapterService]
    });

    serviceUnderTest = TestBed.inject<any>(HttpAdapterService);

    actualResult = undefined;

    serverMock.setup();
  });

  afterEach(() => {
    // Per resettare dopo ogni test
    serverMock.teardown();
  });

  describe('METHOD: patch', () => {
    let fakeUrlArg: string;
    let fakeBodyArg: any;
    let expectedReturnedResult: any;
    let actualBodySent: any;

    Given(() => {
      fakeUrlArg = '/fake';
      fakeBodyArg = {
        fake: 'body'
      };
      expectedReturnedResult = {
        fake: 'result'
      };

      serverMock.patch(fakeUrlArg, (request, response) => {
        actualBodySent = JSON.parse(request.body());
        return response.status(200).body(JSON.stringify(expectedReturnedResult));
      });
    });

    When(
      fakeAsync(async () => {
        actualResult = await serviceUnderTest.patch(fakeUrlArg, fakeBodyArg);
      })
    );

    Then(() => {
      expect(actualResult).toEqual(expectedReturnedResult);
    });
  });
});
