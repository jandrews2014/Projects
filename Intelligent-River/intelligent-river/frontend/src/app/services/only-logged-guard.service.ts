import { Injectable } from '@angular/core';
import {CanActivate} from "@angular/router";
import { AuthService } from '../services/auth.service';


@Injectable()
export class OnlyLoggedGuardService implements CanActivate { 

  constructor(private authService: AuthService) { }

canActivate() {
    if (this.authService.isLoggedIn()) { 
      return true;
    } else {
         (<any>$('#login-modal')).modal('show');
      return false;
    }
  }
}
