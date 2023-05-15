import { Injectable } from '@angular/core';
import { UserCredentials } from '../_types/user-credentials.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() {}

  // TODO: test
  login(credentials: UserCredentials) {
    throw new Error('Method not implemented.');
  }
}
