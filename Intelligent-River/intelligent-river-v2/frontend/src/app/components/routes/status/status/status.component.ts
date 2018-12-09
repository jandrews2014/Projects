import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Project, ProjectsJSON } from '../../../../models/projects.model';
import { Deployment, DeploymentsAllJSON } from '../../../../models/deployments.model';

import { IntelligentRiverService } from '../../../../services/intelligent-river.service';

import { Status, StatusJSON } from '../../../../models/status.model';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  // data variables to listen to irService
  projects: Project[];
  deployments: Deployment[];
  deploymentsByProjectId: any;
  deploymentDetailsByDeploymentId: any;
  deploymentDetailsByProjectId: any;
  currentProject: Project;
  currentDeployment: Deployment;
  hasDeployments: boolean;

  currentProjectId: number;
  currentDeploymentId: number;

  currentStatus: StatusJSON;

  filterDataPropertiesAndUnits: {
    property?: string;
  };
  filterDataProperties: string[];
  filterDataUnits: string[];
  currentData: any;
  dataProcessed: boolean;
  deploymentDataMetadataIndex: {};
  currentFilter: {
    property: string;
    unit: string;
    min: number;
    max: number;
  };

  selectedTab: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private irService: IntelligentRiverService) {
      this.projects = null;
      this.deployments = null;
      this.deploymentsByProjectId = null;
      this.deploymentDetailsByDeploymentId = {};
      this.deploymentDetailsByProjectId = {};

      this.currentProject = null; this.currentProjectId = null;
      this.currentDeployment = null; this.currentDeploymentId = null;
      this.currentStatus = null;

      this.filterDataPropertiesAndUnits = {};
      this.filterDataProperties = null;
      this.filterDataUnits = null;
      this.currentData = null;
      this.dataProcessed = false;
      this.currentFilter = null;

      this.selectedTab = 0;
    }

  ngOnInit() {
    console.log('STATUS.ngOnInit()');

    this.irService.observeProjects.subscribe((projects) => {
      this.projects = projects;
    });

    this.irService.observeDeploymentDetailsByDeploymentId.subscribe((next) => {
      this.deploymentDetailsByDeploymentId = next;
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;

      if (this.currentProject) {
        this.currentProjectId = next.id;

        this.irService.getDeploymentDetailsByProjectId(this.currentProject.id).subscribe((data) => {
          this.deploymentDetailsByProjectId = data;
          if (this.deploymentDetailsByProjectId) {
            console.log('STATUS.getDeploymentDetailsByProjectId(' + this.currentProject.id + ') response',
              this.deploymentDetailsByProjectId);
          }
        });
        this.irService.getStatusByProjectId(this.currentProject.id).subscribe((data) => {
          this.currentStatus = data;
          console.log('STATUS.getStatusByProjectId(' + this.currentProject.id + ') response', this.currentStatus);
        });
      }
    });

    this.irService.observeDeploymentDataMetadataIndex.subscribe((data) => {
      this.deploymentDataMetadataIndex = data;

      console.log('STATUS.deploymentDataMetadataIndex ==', this.deploymentDataMetadataIndex);
      // should populate current filter stuff here but hey whatever.
    });

    this.irService.observeCurrentDeployment.subscribe((newCurrentDeployment) => {
      this.currentDeployment = newCurrentDeployment;
    });

    this.irService.observeDeploymentsByProjectId.subscribe((newDeploymentsByProjectId) => {
      this.deploymentsByProjectId = newDeploymentsByProjectId;
    });
  }


  filterBy(property: string): void {
    this.dataProcessed = false;
    console.log('STATUS.filterBy(' + property + ')');
    this.currentFilter = this.deploymentDataMetadataIndex[this.currentProject.id]['filters'][property];

    // get the bloody current data, this will have to be changed somehow.
    this.irService.getDataCurrent(this.currentProjectId).subscribe((dataCurrent) => {
      console.log('STATUS.deploymentDataMetadataIndex ==', this.deploymentDataMetadataIndex);
      console.log('STATUS.deploymentsCurrentFilter ==', this.currentFilter);
      this.currentData = dataCurrent;
      console.log('STATUS.currentData(preprocessed) ==', this.currentData);

      let dataIndecies: number[];
      let dataIndex: number;
      let dataPoints: number[];
      let dataPoint: number;
      let min: number;
      let max: number;
      Object.keys(this.deploymentDataMetadataIndex[this.currentProject.id]).forEach(deploymentId => {
        if (!(deploymentId === 'filters')) {
          if (deploymentId in this.currentData && property in this.deploymentDataMetadataIndex[this.currentProject.id][deploymentId]) {
            console.log('STATUS', this.deploymentDataMetadataIndex[this.currentProject.id][deploymentId]);
            dataIndecies = this.deploymentDataMetadataIndex[this.currentProject.id][deploymentId][property]['parameterPosition'];
            min = this.currentFilter['min'];
            max = this.currentFilter['max'];
            dataPoints = [];

            console.log('STATUS', dataIndecies, min, max, dataPoints);
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
      console.log('STATUS.currentData(PROCESSED) ==', this.currentData);
      this.dataProcessed = true;
    });
  }

  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }

  onShowHide(event: Event): void {
    const text = event.srcElement.innerHTML;
    console.log('onHide', text);
    if (text === 'Show') {
      event.srcElement.innerHTML = 'Hide';
    } else {
      event.srcElement.innerHTML = 'Show';
    }
  }

  selectStatusNumber(tabNo: number) {
    this.selectedTab = tabNo;
    console.log('STATUS.selectStatusNumber(' + this.selectedTab + ') ==');
  }
}
