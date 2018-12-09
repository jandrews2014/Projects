import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Project, ProjectsJSON } from '../../../../models/projects.model';
import { Deployment, DeploymentsAllJSON, DeploymentsByProjectIdJSON } from '../../../../models/deployments.model';

import { IntelligentRiverService } from '../../../../services/intelligent-river.service';

@Component({
  selector: 'app-data-current',
  templateUrl: './data-current.component.html',
  styleUrls: ['./data-current.component.scss']
})
export class DataCurrentComponent implements OnInit {

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
  deploymentDataMetadataIndex: {};
  currentProject: Project;
  currentDeployment: Deployment;
  hasDeployments: boolean;

  currentProjectId: number;
  currentDeploymentId: number;

  // data variables to construct for data-current map
  filterDataPropertiesAndUnits: {
    property?: string;
  };
  filterDataProperties: string[];
  filterDataUnits: string[];
  currentData: any;
  dataProcessed: boolean;
  trueData: any;
  trueDataFinishedLoading: boolean;
  currentFilter: {
    property: string;
    unit: string;
    min: number;
    max: number;
  };
  randColor: number;
  randColor2: number;

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
      this.deploymentDetailsByDeploymentId = null;
      this.deploymentDataMetadataIndex = {};

      this.currentProject = null; this.currentProjectId = null;
      this.currentDeployment = null; this.currentDeploymentId = null;

      this.filterDataPropertiesAndUnits = {};
      this.filterDataProperties = null;
      this.filterDataUnits = null;
      this.currentData = null;

      this.dataProcessed = false;

      this.trueData = null;
      this.trueDataFinishedLoading = null;
      this.currentFilter = null;
      this.randColor = 0;
      this.randColor2 = 0;
    }

  ngOnInit() {
    console.log('DATA-CURRENT.ngOnInit()');

    this.irService.observeProjects.subscribe((projects) => {
      this.projects = projects;
    });

    this.irService.observeDeploymentDetailsByDeploymentId.subscribe((next) => {
      this.deploymentDetailsByDeploymentId = next;
    });

    this.irService.observeDeploymentDataMetadataIndex.subscribe((data) => {
      this.deploymentDataMetadataIndex = data;

      console.log('DATA-CURRENT.deploymentDataMetadataIndex ==', this.deploymentDataMetadataIndex);
      // should populate current filter stuff here but hey whatever.
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
      console.log('DATA-CURRENT.currentProject ==', this.currentProject);
      this.dataProcessed = false;
      this.currentFilter = null;

      this.filterDataPropertiesAndUnits = {};
      this.filterDataProperties = null;
      this.filterDataUnits = null;
      this.trueData = null;
      this.trueDataFinishedLoading = null;

      if (next) {
        if (this.currentProject) {
          this.currentProjectId = next.id;

          this.irService.getDeploymentDetailsByProjectId(this.currentProjectId).subscribe((data) => {});
        }
      }
    });

    this.irService.observeCurrentDeployment.subscribe((newCurrentDeployment) => {
      this.currentDeployment = newCurrentDeployment;
    });

    this.irService.observeDeploymentsByProjectId.subscribe((next) => {
      this.deploymentsByProjectId = next;

      if (this.deploymentsByProjectId && this.currentProjectId in this.deploymentsByProjectId) {
        const deploymentIdArray: string[] = [];
        const paramsArray: {} = {};
        let deploymentId = '';
        this.filterDataProperties = [];
        this.filterDataUnits = [];
        for (let i = 0; i < this.deploymentsByProjectId[this.currentProjectId].length; i++) {
          deploymentId = this.deploymentsByProjectId[this.currentProjectId][i].id;
          deploymentIdArray.push(deploymentId);

          this.irService.getDeploymentDetailsByDeploymentId(deploymentId).subscribe((nextDetails) => {
            if (nextDetails) {
              const projectId = nextDetails[deploymentIdArray[i]].projectId;
              const sensingId = nextDetails[deploymentIdArray[i]].motestackId.sensing[0].id;
              const deploymentUri = nextDetails[deploymentIdArray[i]].motestackId.uri;

              const length = nextDetails[deploymentIdArray[i]].motestackId.sensing.length;
              for (let j = 0; j < length; j++) {
                const params = nextDetails[deploymentIdArray[i]].motestackId.sensing[j].parameters.length;
                for (let k = 0; k < params; k++) {
                  const prop = nextDetails[deploymentIdArray[i]].motestackId.sensing[j].parameters[k].parameter.property;
                  const unit = nextDetails[deploymentIdArray[i]].motestackId.sensing[j].parameters[k].parameter.unit;
                  this.filterDataPropertiesAndUnits[prop] = unit;
                }
              }
              this.filterDataProperties = Object.keys(this.filterDataPropertiesAndUnits);
              this.filterDataUnits = Object.values(this.filterDataPropertiesAndUnits);
            }
          });
        }
      }
    });

    this.irService.observeDeployments.subscribe((next) => {
      this.deployments = next;
    });
  }

  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }

  filterBy(property: string): void {
    this.dataProcessed = false;
    console.log('DATA-CURRENT.filterBy(' + property + ')');
    this.currentFilter = this.deploymentDataMetadataIndex[this.currentProject.id]['filters'][property];

    // get the bloody current data, this will have to be changed somehow.
    this.irService.getDataCurrent(this.currentProjectId).subscribe((dataCurrent) => {
      console.log('DATA-CURRENT.deploymentDataMetadataIndex ==', this.deploymentDataMetadataIndex);
      console.log('DATA-CURRENT.deploymentsCurrentFilter ==', this.currentFilter);
      this.currentData = dataCurrent;
      console.log('DATA-CURRENT.currentData(preprocessed) ==', this.currentData);

      let dataIndecies: number[];
      let dataIndex: number;
      let dataPoints: number[];
      let dataPoint: number;
      let min: number;
      let max: number;
      Object.keys(this.deploymentDataMetadataIndex[this.currentProject.id]).forEach(deploymentId => {
        if (!(deploymentId === 'filters')) {
          if (deploymentId in this.currentData && property in this.deploymentDataMetadataIndex[this.currentProject.id][deploymentId]) {
            dataIndecies = this.deploymentDataMetadataIndex[this.currentProject.id][deploymentId][property]['parameterPosition'];
            min = this.currentFilter['min'];
            max = this.currentFilter['max'];
            dataPoints = [];

            for (let i = 0; i < dataIndecies.length; i++) {
              dataIndex = dataIndecies[i];
              dataPoints.push(this.currentData[deploymentId]['readings'][dataIndex]);
            }
            dataPoint = dataPoints.reduce((sum, value) => {
              return sum + value;
            }, 0);
            dataPoint = dataPoint / dataPoints.length;
            this.currentData[deploymentId]['readings'] = dataPoint;
            this.currentData[deploymentId]['color'] = 120 * (dataPoint / (max - min));

            this.currentData[deploymentId]['icon'] = 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(
                `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">` +
                  `<circle cx="20" cy="20" r="16" stroke="black" stroke-width="3" fill="hsla(` +
                    this.currentData[deploymentId]['color'] +
                  `, 69%, 43.7%, 0.9)"/>` +
                `</svg>`);

          } else {
            delete this.currentData[deploymentId];
          }
        }
      });

      this.currentData = Object.values(this.currentData);
      console.log('DATA-CURRENT.currentData(PROCESSED) ==', this.currentData);
      this.dataProcessed = true;
    });
  }

  clearCurrentFilter(): void {
    this.currentFilter = null;
  }

  onZoomChanged(event: Event): void {
    console.log('DATA-CURRENT.onZoomChanged(event)', event);
    this.mapZoom = event.target['zoom'];
    console.log('DATA-CURRENT.mapZoom ==', this.mapZoom);
  }
}
