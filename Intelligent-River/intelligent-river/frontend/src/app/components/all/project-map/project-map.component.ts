import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Project, ProjectsJSON } from '../../../models/projects.model';

import { IntelligentRiverService } from '../../../services/intelligent-river.service';

@Component({
  selector: 'app-project-map',
  templateUrl: './project-map.component.html',
  styleUrls: ['./project-map.component.scss']
})
export class ProjectMapComponent implements OnInit {
  lat: number;
  lng: number;
  mapZoom: number;
  iconBase: string;
  icons: {};

  projects: Project[];
  currentProject: Project;
  loadedProjects: boolean;

  constructor(private irService: IntelligentRiverService,
              private router: Router) {
    this.lat = 30.3449153;
    this.lng = -81.8231895;
    this.mapZoom = 6;

    this.iconBase = 'assets/img/pIcons/';
    this.icons = {
      0: this.iconBase + 'rnd.png',
      1: this.iconBase + 'iCity.png',
      2: this.iconBase + 'iFarm.png',
      3: this.iconBase + 'iForest.png',
      4: this.iconBase + 'iRiver.png',
      5: this.iconBase + 'iro.png',
      6: this.iconBase + 'eco.png',
      7: this.iconBase + 'city1.png'
    };

    this.projects = null;
    this.currentProject = null;
    this.loadedProjects = true;
  }

  ngOnInit() {
    console.log('Project-Map init');
    // if (this.route.snapshot.params === {}) {
    //   this.irService.setCurrentProject(null);
    //   this.mapZoom = 6;
    //   this.lat = 30.3449153;
    //   this.lng = -81.8231895;
    // }

    this.irService.observeProjects.subscribe((projects) => {
      this.projects = projects;
      this.loadedProjects = true;
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
      if (next != null) {
        this.lat = this.currentProject.location.lat;
        this.lng = this.currentProject.location.lng;
        this.mapZoom = 15;
      } else {
        this.lat = 30.3449153;
        this.lng = -81.8231895;
        this.mapZoom = 6;
      }
    });
  }

  onClickProject(project: Project, event: Event) {
    const currentResource = this.irService.getCurrentResource();
    console.log('Project Map changeProject(): current resource', currentResource, 'project id', project.id);
    if (currentResource === null) {
      this.router.navigate(['/']);
      this.lat = project.location.lat;
      this.lng = project.location.lng;
    } else {
      this.router.navigate([currentResource, project.id]);
    }

    this.mapZoom = 15;
    this.irService.setCurrentProject(project.id);
    this.irService.setCurrentProjectId(project.id);
  }
}
