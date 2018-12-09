// crypto-js api: https://code.google.com/archive/p/crypto-js/
// examples: https://github.com/brix/crypto-js

import { Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';

import { User, Account, UserJSON } from '../../../models/user.model';

import * as $ from 'jquery';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  username: string;
  email: string;
  password: string;
  confirm: string;

  user: User;
  newUser: User;

  attemptingToSignIn: boolean;
  allowLogin: boolean;
  loggedIn: boolean;
  loginStatus: boolean;
  loginAttempts: {};

  constructor(private authService: AuthService) {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirm = '';

    this.attemptingToSignIn = false;
    this.allowLogin = true;
    this.loginStatus = false;
    this.loginAttempts = {};
  }

  ngOnInit() {
    console.log('Login init');
  }

  ngAfterViewInit() {
    /*
    TODO: insert tooltip as form validation, jquery gets put here apparently.
      https://getbootstrap.com/docs/4.0/components/tooltips/#static-demo

    */
    // $('#example').tooltip({
    //   html: true
    // });
    $('body');
  }

  onSignIn(value, invalid): void {
    if (invalid) {
      console.log('signin invalid');
      this.allowLogin = false;
    } else {
      const hash = CryptoJS.SHA1(this.password);
      const pass = hash.toString(CryptoJS.enc.Base32);

      this.attemptingToSignIn = true;
      this.authService.postSignIn(this.username, pass).subscribe(data => {
        console.log(data);
        if (data['status'] === 'failure') {
          this.allowLogin = false;
          setTimeout(() => {
            this.attemptingToSignIn = false;
            this.allowLogin = true;
          }, 3000);

          if (this.email in this.loginAttempts) {
            this.loginAttempts[this.email] += 1;
          } else {
            this.loginAttempts[this.email] = 0;
          }
          console.log(this.loginAttempts);
        } else if (data['status'] === 'success') {
          this.user = data.user;
          this.user.token = data.user.token;

          this.attemptingToSignIn = false;
          this.loggedIn = true;

          this.username = '';
          this.password = '';

          this.authService.setUserInStorage();
        }
      });
    }
  }

  onSignUp(value, invalid) {
    if (invalid) {
      console.log('sign up invalid');
    } else {
      console.log('sign up not implemented');
    }
  }
}
