import { fakeAsync, TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { LlamaRemoteService, LLAMAS_REMOTE_PATH } from './llama-remote.service';
import { Llama } from '../../_types/llama.type';
import { HttpClient } from '@angular/common/http';
import { HttpAdapterService } from '../adapters/http-adapter/http-adapter.service';

describe('LlamaRemoteService', () => {
  let serviceUnderTest: LlamaRemoteService;
  let httpSpy: Spy<HttpClient>;
  let httpAdapterServiceSpy: Spy<HttpAdapterService>;

  let fakeLlamas: Llama[];
  let actualResult: any;
  let actualError: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LlamaRemoteService,
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) },
        { provide: HttpAdapterService, useValue: createSpyFromClass(HttpAdapterService) }
      ]
    });

    serviceUnderTest = TestBed.inject<any>(LlamaRemoteService);
    httpSpy = TestBed.inject<any>(HttpClient);
    httpAdapterServiceSpy = TestBed.inject<any>(HttpAdapterService);

    fakeLlamas = undefined;
    actualResult = undefined;
    actualError = undefined;
  });

  describe('METHOD: getLlamasFromServer', () => {
    When(() => {
      serviceUnderTest.getLlamasFromServer().subscribe(value => (actualResult = value));
    });

    describe('GIVEN a successful request THEN return the llamas', () => {
      Given(() => {
        fakeLlamas = [{ id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' }];
        httpSpy.get.and.nextOneTimeWith(fakeLlamas);
      });
      Then(() => {
        expect(actualResult).toEqual(fakeLlamas);
      });
    });
  });

  describe('METHOD: update', () => {
    let fakeLlamaIdArg: string;
    let fakeLlamaChangesArg: Partial<Llama>;

    When(
      fakeAsync(async () => {
        try {
          actualResult = await serviceUnderTest.update(
            fakeLlamaIdArg,
            fakeLlamaChangesArg
          );
        } catch (error) {
          actualError = error;
        }
      })
    );

    describe('GIVEN update was successful THEN return the updated llama', () => {
      let expectedReturnedLlama: Llama;

      Given(() => {
        fakeLlamaIdArg = 'FAKE ID';
        fakeLlamaChangesArg = {
          pokedByTheseLlamas: ['FAKE USER LLAMA ID']
        };

        expectedReturnedLlama = createDefaultFakeLlama();
        expectedReturnedLlama.id = fakeLlamaIdArg;
        expectedReturnedLlama.pokedByTheseLlamas = ['FAKE USER LLAMA ID'];

        const expectedUrl = `${LLAMAS_REMOTE_PATH}/${fakeLlamaIdArg}`;
        httpAdapterServiceSpy.patch
          .mustBeCalledWith(expectedUrl, fakeLlamaChangesArg)
          .resolveWith(expectedReturnedLlama);
      });

      Then(() => {
        expect(actualResult).toEqual(expectedReturnedLlama);
      });
    });

    describe('GIVEN update failed THEN rethrow the error', () => {
      Given(() => {
        httpAdapterServiceSpy.patch.and.rejectWith('FAKE ERROR');
      });

      Then(() => {
        expect(actualError).toEqual('FAKE ERROR');
      });
    });
  });
});

function createDefaultFakeLlama(): Llama {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
