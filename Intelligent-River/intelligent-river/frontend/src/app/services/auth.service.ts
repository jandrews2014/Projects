import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as moment from 'moment/moment.js';

import { Project, ProjectsJSON } from '../models/projects.model';
import { Statistics, StatisticsJSON } from '../models/statistics.model';
import { Deployment, DeploymentsByProjectIdJSON, DeploymentsAllJSON } from '../models/deployments.model';
import { User, Account, UserJSON } from '../models/user.model';

@Injectable()
export class AuthService {
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private currentUser: User;
  private loggedIn: boolean;
  observeLoggedIn: BehaviorSubject<boolean>;
  observeCurrentUser: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.loggedIn = this.currentUser ? true : false;
    this.observeLoggedIn = new BehaviorSubject<boolean>(this.currentUser ? true : false);
    this.observeCurrentUser = new BehaviorSubject<User>(this.currentUser ? this.currentUser : null);
    console.log('Auth Service init');
    this.retrieveUserFromStorage();
    console.log('Auth Service: current user from storage', this.currentUser);
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isLoggedIn(): any {
    return this.loggedIn;
  }

  postSignIn(login: string, passwordSHA1: string): Observable<UserJSON> {
    console.log('Auth Service: postSignIn(' + login + ', ' + passwordSHA1 + ') new HTTP request');
    const body = {
      login: login,
      passwordSHA1: passwordSHA1
    };
    return this.http.post('/api/signIn', body, {
      headers: this.headers
    }).map(
      ( response: UserJSON) => {
        console.log('Auth Service: postSignIn() response', response);
        if (response['status'] === 'success') {
          this.currentUser = response.user;
          this.observeCurrentUser.next(this.currentUser);
          this.loggedIn = true;
          this.observeLoggedIn.next(true);
          this.setUserInStorage();
        }
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  postSignOut(login: string, token: string): Observable<UserJSON> {
    console.log('Auth Service: postSignOut() new HTTP Request');
    const body = {
      login: login,
      token: token
    };
    return this.http.post('/api/signOut', body, {
      headers: this.headers
    }).map(
      ( response: UserJSON) => {
        console.log('Auth Service: postSignOut() response', response);
        if (response['status'] === 'success') {
          this.currentUser = null;
          this.observeCurrentUser.next(null);
          this.loggedIn = false;
          this.observeLoggedIn.next(false);
          this.clearUserInStorage();
        }
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }


  setUserInStorage(): void {
    const now: any = moment();
    localStorage.setItem('intelligentriver.org-currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('intelligentriver.org-lastLogin', JSON.stringify(now.toISOString()));
  }

  retrieveUserFromStorage(): void {
    const now = moment();
    console.log('Auth Service: now', now.toISOString());
    if (localStorage.getItem('intelligentriver.org-lastLogin') === null) {
      this.currentUser = null;
      this.loggedIn = false;
    } else {
      let then: any = JSON.parse(localStorage.getItem('intelligentriver.org-lastLogin'));
      console.log('Auth Service: lastLogin', then);
      then = moment(then);

      if (now.diff(then, 'days') < 7) {
        console.log('Auth Service: last update less than 7 days, using local storage');
        if (localStorage.getItem('intelligentriver.org-currentUser') === null) {
          localStorage.setItem('intelligentriver.org-currentUser', JSON.stringify(this.currentUser));
        } else {
          const data: any = JSON.parse(localStorage.getItem('intelligentriver.org-currentUser'));
          console.log('retrieve user', data);
          this.currentUser = data === 'undefined' ? null : data;
          if (this.currentUser) {
            this.observeCurrentUser.next(this.currentUser);
          } else {
            this.observeCurrentUser.next(null);
          }
          if (this.currentUser) {
            this.loggedIn = true;
            this.observeLoggedIn.next(true);
          } else {
            this.loggedIn = false;
            this.observeLoggedIn.next(false);
          }
        }
      } else {
        console.log('Auth Service: last update greater than 7 days, clearing local storage');
        this.clearUserInStorage();
      }
    }
  }

  clearUserInStorage(): void {
    localStorage.removeItem('intelligentriver.org-currentUser');
  }
}
