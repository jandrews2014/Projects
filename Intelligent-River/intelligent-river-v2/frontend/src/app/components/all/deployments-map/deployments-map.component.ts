import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Project, ProjectsJSON } from '../../../models/projects.model';
import { Deployment, DeploymentsAllJSON } from '../../../models/deployments.model';

import { IntelligentRiverService } from '../../../services/intelligent-river.service';

declare var $: any;


@Component({
  selector: 'app-deployments-map',
  templateUrl: './deployments-map.component.html',
  styleUrls: ['./deployments-map.component.scss']
})
export class DeploymentsMapComponent implements OnInit {
  // ng-map variables
  lat: number;
  lng: number;
  mapZoom: number;
  mapType: string;
  motestackIcon: string;
  iconBase: string;
  icons: {};
  markers: {};

  // data variables to listen to irService
  projects: Project[];
  deployments: Deployment[];
  deploymentsByProjectId: any;
  deploymentDetailsByDeploymentId: any;
  currentProject: Project;
  currentDeployment: Deployment;
  hasDeployments: boolean;

  currentProjectId: number;
  currentDeploymentId: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private irService: IntelligentRiverService) {
      this.lat = 30.3449153;
      this.lng = -81.8231895;
      this.mapZoom = 6;
      this.mapType = 'satellite';
      this.motestackIcon = 'assets/img/motestack/motestack.png';
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
      this.markers = {};

      this.projects = null;
      this.deployments = null;
      this.deploymentsByProjectId = null;
      this.deploymentDetailsByDeploymentId = {};

      this.currentProject = null; this.currentProjectId = null;
      this.currentDeployment = null; this.currentDeploymentId = null;
    }

  ngOnInit() {
    console.log('Delpoyments-map init');

    this.irService.observeProjects.subscribe((projects) => {
      this.projects = projects;
    });

    this.irService.observeDeploymentDetailsByDeploymentId.subscribe((next) => {
      this.deploymentDetailsByDeploymentId = next;
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
      console.log('DEPLOYMENTS-MAP.currentProject ==', this.currentProject);
      if (next) {
        this.currentProjectId = next.id;
        if (this.currentProject) {
          console.log('DEPLOYMENTS-MAP.getDeploymentsByProjectId(' + this.currentProject.id + ')');
          this.irService.getDeploymentsByProjectId(this.currentProject.id).subscribe((data) => {
            if (!data) {
              return;
            }

            console.log('DEPLOYMENTS-MAP.getDeploymentsByProjectId(' + this.currentProject.id + ') response', data);
            const length = data[this.currentProject.id]['length'];
            if (length > 0) {
              this.markers = [];
              let temp_lat = 0; let temp_lng = 0;
              let max_lat = -91;
              let max_lng = -181;
              let min_lat = 91;
              let min_lng = 181;
              for (let i = 0; i < length; i++) {
                const lat = data[this.currentProject.id][i]['location']['lat'];
                const lng = data[this.currentProject.id][i]['location']['lng'];

                temp_lat += lat;
                temp_lng += lng;

                if (max_lat < temp_lat) {
                  max_lat = lat;
                }

                if (min_lat > temp_lat) {
                  min_lat = lat;
                }

                if (max_lng < temp_lng) {
                  max_lng = lng;
                }

                if (min_lng > temp_lng) {
                  min_lng = lng;
                }
              }
              this.lat = temp_lat / length;
              this.lng = temp_lng / length;

              const diff_lat = max_lat - min_lat;
              const diff_lng = max_lng - min_lng;
              let offset = diff_lat > diff_lng ? diff_lat : diff_lng;
              console.log(offset, Math.log2(Math.abs(offset)));
              offset = Math.round(Math.log2(Math.abs(offset)));
              if (Number.isNaN(offset) || !Number.isFinite(offset) || offset < -8) {
                this.mapZoom = 16;
              } else {
                this.mapZoom = 8 - offset;
              }
            } else {
              this.hasDeployments = false;
              this.lat = 30.3449153;
              this.lng = -81.8231895;
              this.mapZoom = 3;
            }
          });
        }
      }
    });

    this.irService.observeCurrentDeployment.subscribe((newCurrentDeployment) => {
      this.currentDeployment = newCurrentDeployment;
    });

    this.irService.observeDeploymentsByProjectId.subscribe((newDeploymentsByProjectId) => {
      this.deploymentsByProjectId = newDeploymentsByProjectId;
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

  onDeploymentClicked(event: Event, domPrefix: string, deploymentId: string): void {
    // console.log(event.target, deploymentId);
    // const marker = event.target;
    // console.log(this.deploymentDetailsByDeploymentId[deploymentId]);
    // marker.nguiMapComponent.openInfoWindow(deploymentId, marker);

    this.irService.getDeploymentDetailsByDeploymentId(deploymentId).subscribe((details) => {});
    this.irService.setCurrentDeployment(this.deploymentDetailsByDeploymentId[deploymentId]);
    this.irService.setCurrentDeploymentId(deploymentId);
    $(domPrefix + deploymentId).modal('show');
    console.log('DEPLOYMENTS MAP -> onDeploymentClicked(event, ' + domPrefix + '. ' + deploymentId + ')', event);
  }

  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }

  onShowHide(event: Event): void {
    const text = event.srcElement.innerHTML;
    if (text === 'Show') {
      event.srcElement.innerHTML = 'Hide';
    } else {
      event.srcElement.innerHTML = 'Show';
    }
  }
}
