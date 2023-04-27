import { FrontService } from './front.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';

describe('FrontService', () => {
  let serviceUnderTest: FrontService;
  let llamaRemoteServiceSpy: Spy<LlamaRemoteService>;
  let fakeLlamas: Llama[];
  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        FrontService,
        { provide: LlamaRemoteService, useValue: createSpyFromClass(LlamaRemoteService) }
      ]
    });

    serviceUnderTest = TestBed.inject<any>(FrontService);
    llamaRemoteServiceSpy = TestBed.inject<any>(LlamaRemoteService);

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
    Given(() => {
      serviceUnderTest.userLlama = createDefaultFakeLlama();
      fakeUserLlamaId = 'FAKE USER LLAMA ID';
      serviceUnderTest.userLlama.id = fakeUserLlamaId;
    });

    When(() => {
      serviceUnderTest.pokeLlama(fakeLlama);
    });
    // Mutual code end

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

function createDefaultFakeLlama(): Llama {
  return { id: 'FAKE ID', name: 'FAKE NAME', imageFileName: 'FAKE IMAGE' };
}
