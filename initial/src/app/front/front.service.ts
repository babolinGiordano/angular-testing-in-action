import { Injectable } from '@angular/core';
import { Llama } from '../_types/llama.type';
import { LlamaRemoteService } from '../_services/llama-remote/llama-remote.service';
import { RouterAdapterService } from '../_services/router-adapter/router-adapter.service';
import { appRoutesName } from '../app.routes.names';

@Injectable({
  providedIn: 'root'
})
export class FrontService {
  userLlama: Llama;

  constructor(
    private llamaRemoteService: LlamaRemoteService,
    private routerAdaperService: RouterAdapterService
  ) {}

  getFeaturedLlamas(config?: any): Promise<Llama[]> {
    return this.llamaRemoteService.getLlamasFromServer().toPromise();
  }

  // TODO: handle errors
  pokeLlama(llama: Llama) {
    if (!this.userLlama) {
      this.routerAdaperService.goToUrl(`/${appRoutesName.LOGIN}`);
      return;
    }
    const userLlamaId = this.userLlama.id;

    const pokedByClone = llama.pokedByTheseLlamas ? [...llama.pokedByTheseLlamas] : [];
    pokedByClone.push(userLlamaId);

    this.llamaRemoteService.update(llama.id, {
      pokedByTheseLlamas: pokedByClone
    });
  }
}
