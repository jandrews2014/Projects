import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET} from '@angular/router';
import { Title } from '@angular/platform-browser';

import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';

import { Project, ProjectsJSON } from './models/projects.model';
import { Statistics, StatisticsJSON } from './models/statistics.model';
import { Deployment, DeploymentsByProjectIdJSON, DeploymentsAllJSON } from './models/deployments.model';
import { User, Account, UserJSON } from './models/user.model';

import { IntelligentRiverService } from './services/intelligent-river.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sub: Subscription;

  constructor(public router: Router,
              public activated: ActivatedRoute,
              private titleService: Title,
              private authService: AuthService,
              private irService: IntelligentRiverService) {
    }

  ngOnInit() {
    console.log('App init');

    // don't do anything with the returned Observable
    // the other components grab data from irService by observing
    //    subjects
    this.irService.getProjects().subscribe(projects => {});

    this.irService.getDeployments().subscribe(deployments => {});

  }
}
