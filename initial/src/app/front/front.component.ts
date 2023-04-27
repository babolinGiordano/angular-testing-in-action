import { Component, OnInit } from '@angular/core';
import { FrontService } from './front.service';
import { Llama } from '../_types/llama.type';
import { RouterAdapterService } from '../_services/router-adapter/router-adapter.service';
import { appRoutesName } from '../app.routes.names';

@Component({
  selector: 'ld-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {
  llamaPageLink = `/${appRoutesName.LLAMA_PAGE}`;
  llamas: Llama[];
  showErrorMessage: boolean;

  constructor(private frontService: FrontService, private router: RouterAdapterService) {}

  ngOnInit() {
    return this.frontService.getFeaturedLlamas({ newest: true }).then(
      result => {
        this.llamas = result;
      },
      error => {
        this.showErrorMessage = true;
      }
    );
  }

  isListVisible(): boolean {
    return !!this.llamas && this.llamas.length > 0;
  }

  // TODO: handle errors?
  poke(llama: Llama) {
    this.frontService.pokeLlama(llama);
  }
}
