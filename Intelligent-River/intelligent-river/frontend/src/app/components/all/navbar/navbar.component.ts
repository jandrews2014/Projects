import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { IntelligentRiverService } from '../../../services/intelligent-river.service';
import { RouteService } from '../../../services/route.service';
import { AuthService } from '../../../services/auth.service';

import { Project, ProjectsJSON } from '../../../models/projects.model';
import { Statistics, StatisticsJSON } from '../../../models/statistics.model';
import { User } from '../../../models/user.model';
import { Deployment, DeploymentsByProjectIdJSON, DeploymentsAllJSON } from '../../../models/deployments.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentProject: Project;
  currentUser: User;
  loggedIn: boolean;
  loggedOutSuccess: boolean;
  loggedOutMessage: string;
  attemptingToSignOut: boolean;

  projects: Project[];
  statistics: Statistics;
  routeData: any;

  constructor(private irService: IntelligentRiverService,
              private authService: AuthService,
              private router: Router) {
    this.currentProject = null, this.projects = null, this.statistics = null;
    this.loggedOutSuccess = false;
    this.loggedOutMessage = null;
    this.attemptingToSignOut = false;
   }

  ngOnInit() {
    console.log('Navbar init');

    this.authService.observeLoggedIn.subscribe((next) => {
      this.loggedIn = next;
      (<any>$('#login-modal')).modal('hide');
      (<any>$('#logout-modal')).modal('hide');
    });

    this.authService.observeCurrentUser.subscribe((next) => {
      this.currentUser = next;
    });

    this.irService.observeProjects.subscribe((next) => {
      this.projects = next;
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
    });
  }


  onClickStatistics(event: Event) {
    // guaranteed fresh on click.
    console.log('Navbar -> onClickStatistics(event)', event);
    this.irService.getStatistics().subscribe((statistics) => {
      this.statistics = statistics;
    });
  }

  changeProject(project: Project): void {
    const currentResource = this.irService.getCurrentResource();
    if (currentResource === null) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate([currentResource, project.id]);
    }

    this.irService.setCurrentProject(project.id);
    this.irService.setCurrentProjectId(project.id);
    console.log('Navbar -> changeProject(project)', 'currentResource', currentResource, 'new project id', project.id);
  }

  clearCurrentProject(): void {
    this.irService.setCurrentProject(null);
    this.irService.setCurrentProjectId(null);
    this.router.navigate([this.irService.getCurrentResource()]);
  }

  logout(): void {
    console.log('Navbar -> logout()');
    this.attemptingToSignOut = true;
    this.authService.postSignOut(this.currentUser.username, this.currentUser.token).subscribe((results) => {
      if ('status' in results) {
        this.attemptingToSignOut = false;
        if (results['status'] === 'success') {
          this.loggedOutMessage = 'successfully logged out';
        } else {
          this.loggedOutMessage = 'not logged out, something went wrong';
        }
      } else {
        this.attemptingToSignOut = false;
        this.loggedOutMessage = 'something DREADFULLY wrong has occured, please consult weeping dev in corner';
      }
      this.authService.clearUserInStorage();
      setTimeout(() => {
        this.loggedOutMessage = null;
      }, 5000);
    });
  }

  etPhoneHome(): void {
    console.log('NAVBAR -> etPhoneHome()');
    this.irService.setCurrentProject(null);
    this.irService.setCurrentProjectId(null);
  }
}
