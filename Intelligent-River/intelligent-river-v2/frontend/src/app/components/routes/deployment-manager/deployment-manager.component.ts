import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-deployment-manager',
  templateUrl: './deployment-manager.component.html',
  styleUrls: ['./deployment-manager.component.scss']
})
export class DeploymentManagerComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { 
     this.authService.observeLoggedIn.subscribe((next) => {
      if(!next)
        this.router.navigate(['/']);
    });
  }

  ngOnInit() {
  }

}
