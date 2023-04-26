import { Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
import { LlamaPageComponent } from './llama-page/llama-page.component';
import { appRoutesName } from './app.routes.names';

export const APP_ROUTES: Routes = [
  { path: '', component: FrontComponent },
  { path: `${appRoutesName.LLAMA_PAGE}/:id`, component: LlamaPageComponent }
];
