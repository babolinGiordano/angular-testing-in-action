import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { appRoutesNames } from '../app.routes.names';

@Component({
  selector: 'ld-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerLink = `/${appRoutesNames.REGISTER}`;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(private loginService: LoginService) {}

  get emailControl(): AbstractControl {
    return this.loginForm.get('email');
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {}

  handleLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.loginService.login(credentials);
    }
  }
}
