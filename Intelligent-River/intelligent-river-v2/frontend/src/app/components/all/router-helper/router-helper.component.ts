import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Project, ProjectsJSON } from '../../../models/projects.model';

import { IntelligentRiverService } from '../../../services/intelligent-river.service';

@Component({
  selector: 'app-router-helper',
  templateUrl: './router-helper.component.html',
  styleUrls: ['./router-helper.component.scss']
})
export class RouterHelperComponent implements OnInit {
  currentRoute: string;
  currentPath: string[];
  currentParams: {};
  currentResource: string;
  currentProjectId: number;
  currentDeploymentId: string;

  constructor(private irService: IntelligentRiverService,
    private route: ActivatedRoute,
    private router: Router) {
      console.log();

      this.currentRoute = '';
      this.currentPath = [];
      this.currentParams = {};
      this.currentResource = '';
      this.currentProjectId = -1;
      this.currentDeploymentId = null;
    }

  ngOnInit() {
    console.log('RouterHelper init');

    // all uri data is parsed and which variable is loaded determines which component is loaded
    this.irService.observeProjects.subscribe((projects) => {

      // need to observe that projects are loaded first, and then we can proceed.
      if (projects != null) {
        this.route.params.subscribe((data) => {
          this.currentParams = data;
          if ('resource' in data) {
            this.currentResource = data['resource'];
            this.irService.setCurrentResource(this.currentResource);
          } else {
            this.irService.setCurrentResource(null);
          }
          if ('projectId' in data) {
            this.currentProjectId = data['projectId'];
            this.irService.setCurrentProjectId(this.currentProjectId);
            this.irService.setCurrentProject(this.currentProjectId);
          }
          if ('deploymentId' in data) {
            this.currentDeploymentId = data['deploymentId'];
            this.irService.setCurrentDeploymentId(this.currentDeploymentId);
          }

          console.log('RouterHelper activeRoute event', data);
        });
      }
    });

    this.router.events.subscribe((data: any) => {
      this.currentRoute = this.router.url;
      this.currentPath = this.currentRoute.split('/');
      this.currentPath.splice(0, 1);
      console.log('RouterHelper router event', this.currentRoute, this.currentPath, this.currentResource, this.currentParams);
    });
  }

}
