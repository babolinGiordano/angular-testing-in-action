import { LoginComponent } from './login.component';
import { TestBed } from '@angular/core/testing';
import { UserCredentials } from '../_types/user-credentials.type';
import { LoginService } from './login.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { appRoutesNames } from '../app.routes.names';

describe('LoginComponent', () => {
  let componentUnderTest: LoginComponent;
  let loginServiceSpy: Spy<LoginService>;

  let fakeValue: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginComponent,
        { provide: LoginService, useValue: createSpyFromClass(LoginService) }
      ]
    });

    componentUnderTest = TestBed.inject<any>(LoginComponent);
    loginServiceSpy = TestBed.inject<any>(LoginService);

    fakeValue = undefined;
  });

  describe('INIT', () => {
    Then(() => {
      expect(componentUnderTest.registerLink).toEqual(`/${appRoutesNames.REGISTER}`);
    });
  });

  describe('EVENT: email changed', () => {
    When(() => {
      componentUnderTest.emailControl.setValue(fakeValue);
    });

    describe('GIVEN email is empty THEN validation should fail', () => {
      Given(() => {
        fakeValue = '';
      });
      Then(() => {
        expect(componentUnderTest.emailControl.valid).toBeFalsy();
      });
    });

    describe('GIVEN email is not valid email address THEN validation should fail', () => {
      Given(() => {
        fakeValue = 'NOT AN EMAIL';
      });
      Then(() => {
        expect(componentUnderTest.emailControl.valid).toBeFalsy();
      });
    });
  });

  describe('EVENT: password changed', () => {
    When(() => {
      componentUnderTest.passwordControl.setValue(fakeValue);
    });

    describe('GIVEN password is empty THEN validation should fail', () => {
      Given(() => {
        fakeValue = '';
      });
      Then(() => {
        expect(componentUnderTest.passwordControl.valid).toBeFalsy();
      });
    });

    describe('GIVEN password is too short THEN validation should fail', () => {
      Given(() => {
        fakeValue = '1234';
      });
      Then(() => {
        expect(componentUnderTest.passwordControl.valid).toBeFalsy();
      });
    });
  });

  describe('METHOD: handleLogin', () => {
    let fakeCredentials: UserCredentials;

    When(() => {
      componentUnderTest.handleLogin();
    });

    describe('GIVEN form data is valid THEN pass credentials to the service', () => {
      Given(() => {
        // form data is valid
        fakeCredentials = {
          email: 'FAKE@EMAIL.com',
          password: 'FAKE PASSWORD'
        };

        componentUnderTest.loginForm.setValue(fakeCredentials);
      });

      Then(() => {
        // pass credentials to the service
        expect(loginServiceSpy.login).toHaveBeenCalledWith(fakeCredentials);
      });
    });

    describe('GIVEN form data is not valid THEN do not pass credential to service ', () => {
      Given(() => {
        // form data is valid
        fakeCredentials = {
          email: '',
          password: ''
        };

        componentUnderTest.loginForm.setValue(fakeCredentials);
      });

      Then(() => {
        // pass credentials to the service
        expect(loginServiceSpy.login).not.toHaveBeenCalledWith(fakeCredentials);
      });
    });
  });
});
