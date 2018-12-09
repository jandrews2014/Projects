import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as moment from 'moment';
import * as $ from 'jquery';

import { Project, ProjectsJSON } from '../models/projects.model';
import { Statistics, StatisticsJSON } from '../models/statistics.model';
import {Radio} from '../models/radios.model';
import {Template , SensingTemplate} from '../models/template.model';
import {Device, DeviceForm} from '../models/device.model';
import { Motestack, MotestackForm } from '../models/motestack.model'
import { Maintenance, MaintenanceAllJSON } from '../models/maintenance.model';
import { Deployment, DeploymentDetails, DeploymentsByProjectId, DeploymentsByProjectIdJSON, DeploymentsAllJSON,
  DeploymentDetailsByDeploymentIdJSON, DeploymentDetailsByDeploymentId, DeploymentsForm,
  Sensing, SensingDevice, Parameter, CommConfig, RadioOptions } from '../models/deployments.model';
import { User, Account, UserJSON } from '../models/user.model';
import { DeploymentDataMetadataIndex } from '../models/auxiliary.model';
import { DataTemporary, DataTemporaryJSON } from '../models/data.model';
import { DE910Diagnostics, Diagnostics, DiagnosticsJSON, ADSDiagnostics,
  SDI12Diagnostics, AppDiagnostics, GM862Diagnostics, LogDiagnostics, OneWireDiagnostics, XBee900Diagnostics,
  Observation, ObservationMessage } from '../models/diagnostics.model';
import { Status, StatusJSON, MoteStackMessage } from '../models/status.model';

@Injectable()
export class IntelligentRiverService {
  // utils
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private lastUpdate: any;

  // current vars
  private currentProjectId: number;
  private currentProject: Project;
  observeCurrentProject: Subject<Project>;

  private currentDeploymentId: string;
  private currentDeployment: Deployment;
  observeCurrentDeployment: Subject<Deployment>;

  private currentMaintenance: Maintenance;
  observeCurrentMaintenance: Subject<Maintenance>;

  // resources
  private currentResource: string;
  private statistics: StatisticsJSON;
  observeStatistics: Subject<Statistics>;
  private projects: ProjectsJSON;
  observeProjects: Subject<Project[]>;
  private deployments: DeploymentsAllJSON;
  observeDeployments: Subject<Deployment[]>;
  private motestacks: Motestack[];
  observeMotestacks: Subject<Motestack[]>;
  private deploymentsByProjectId: {};
  observeDeploymentsByProjectId: Subject<any>;
  private deploymentDetailsByProjectId: {};
  observeDeploymentDetailsByProjectId: BehaviorSubject<{}>;
  private deploymentDataMetadataIndex: {};
  observeDeploymentDataMetadataIndex: BehaviorSubject<{}>;
  private deploymentDetailsByDeploymentId: DeploymentDetailsByDeploymentIdJSON;
  observeDeploymentDetailsByDeploymentId: Subject<DeploymentDetailsByDeploymentIdJSON>;
  private maintenance: MaintenanceAllJSON;
  observeMaintenance: Subject<any>;
  private maintenanceByProjectId: {};
  observeMaintenanceByProjectId: Subject<any>;
  private diagnostics: Diagnostics;
   private deploymentsFormByProjectId: {};
  observeDeploymentsFormByProjectId: Subject<any>;

  // localstorage keys
  public localStorageKeys: {};

  constructor(private http: HttpClient) {
    console.log('Intelligent River Service init');
    this.localStorageKeys = {
      'intelligent-river-lastUpdate': this.lastUpdate,
      'intelligent-river-projects': this.projects,
      'intelligent-river-statistics': this.statistics,
      'intelligent-river-deployments': this.deployments,
      'intelligen-river-motestacks': this.motestacks,
      'intelligent-river-deploymentsByProjectId': this.deploymentsByProjectId,
      'intelligent-river-deploymentDetailsByProjectId': this.deploymentDetailsByProjectId,
      'intelligent-river-deploymentDetailsByDeploymentId': this.deploymentDetailsByDeploymentId,
      'intelligent-river-deploymentDataMetadataIndex': this.deploymentDataMetadataIndex,
      'intelligent-river-maintenance': this.maintenance,
      'intelligent-river-maintenanceByProjectId': this.maintenanceByProjectId,
      'intelligent-river-deploymentsFormByProjectId': this.deploymentsFormByProjectId,
    };

    this.currentProjectId = null; this.currentDeploymentId = null; this.currentResource = null; this.currentMaintenance = null;
    this.projects = null, this.statistics = null, this.deployments = null, this.deploymentsByProjectId = null;
    this.maintenanceByProjectId = {};
    this.deploymentsByProjectId = {};
    this.deploymentDataMetadataIndex = {};
    this.deploymentDetailsByProjectId = {};
    this.deploymentDetailsByDeploymentId = {};
    this.deploymentsFormByProjectId = {};

    this.observeStatistics = new BehaviorSubject<Statistics>(null);
    this.observeCurrentProject = new BehaviorSubject<Project>(null);
    this.observeProjects = new BehaviorSubject<Project[]>(null);
    this.observeCurrentDeployment = new BehaviorSubject<Deployment>(null);
    this.observeDeployments = new BehaviorSubject<Deployment[]>(null);
    this.observeMotestacks = new BehaviorSubject<Motestack[]>(null);
    this.observeDeploymentDetailsByProjectId = new BehaviorSubject<{}>(null);
    this.observeDeploymentDataMetadataIndex = new BehaviorSubject<{}>(null);
    this.observeDeploymentsByProjectId = new BehaviorSubject<any>(null);
    this.observeDeploymentDetailsByDeploymentId = new BehaviorSubject<DeploymentDetailsByDeploymentIdJSON>({});
    this.observeMaintenance = new BehaviorSubject<Maintenance[]>(null);
    this.observeMaintenanceByProjectId = new BehaviorSubject<any>({});
    this.observeDeploymentsFormByProjectId = new BehaviorSubject<DeploymentsForm[]>(null);

    this.loadLocalStorage();
  }

  getCurrentProjectId(): number {
    return this.currentProjectId;
  }

  setCurrentProjectId(projectId: number): void {
    this.currentProjectId = projectId;
  }

  getCurrentResource(): string {
    return this.currentResource;
  }

  setCurrentResource(resource: string): void {
    this.currentResource = resource;
  }

  getCurrentDeploymentId(): string {
    return this.currentDeploymentId;
  }

  setCurrentDeploymentId(deploymentId: string): void {
    this.currentDeploymentId = deploymentId;

    console.log('Intelligent River Service: current deployment updated', this.currentDeployment);
  }

  setStatistics(statistics: StatisticsJSON): void {
    this.observeStatistics.next(null);
    this.statistics = statistics;
    this.observeStatistics.next(this.statistics.statistics);

    console.log('Intelligent River Service: statistics updated', this.statistics);
  }

  setCurrentProject(currentProjectId: number): void {
    if (currentProjectId === null) {
      this.currentProject = null;
    } else {
      for (let i = 0; i < this.projects.projects.length; i++) {
        if (this.projects.projects[i].id === currentProjectId) {
          this.currentProject = this.projects.projects[i];
        }
      }
    }
    this.observeCurrentProject.next(this.currentProject);
    this.currentProjectId = currentProjectId;

    console.log('Intelligent River Service: current project updated', 'current project:',
      this.currentProject, 'currentProjectId:', this.currentProjectId);
  }

  setProjects(projects: ProjectsJSON): void {
    // this.observeProjects.next(null);
    this.projects = projects;
    this.observeProjects.next(this.projects.projects);
    this.saveLocalStorage('intelligentriver.org-projects', this.projects);

    console.log('Intelligent River Service: projects updated and locally saved', this.projects);
  }

  setCurrentDeployment(currentDeployment): void {
    // this.observeCurrentDeployment.next(null);
    this.currentDeployment = currentDeployment;
    this.observeCurrentDeployment.next(this.currentDeployment);
    if (currentDeployment) {
      this.currentDeploymentId = currentDeployment.id;
    }
    console.log('Intelligent River Service: current deployment updated and locally saved', this.currentDeployment);
  }

  setAllDeployments(deployments: DeploymentsAllJSON): void {
    // this.observeDeployments.next(null);
    this.deployments = deployments;
    this.observeDeployments.next(this.deployments.deployments);
    this.saveLocalStorage('intelligentriver.org-deployments', this.deployments);

    console.log('Intelligent River Service: deployments updated and locally saved', this.deployments);
  }

  addDeploymentDataMetadataIndexByProjectId(projectId: number, deploymentDetailsByProjectId: DeploymentDetails[]): void {
    if (projectId in this.deploymentDataMetadataIndex) {
      return;
    } else {
      const objByProjectId: {} = {};
      let deployment: DeploymentDetails;
      let deploymentId: string;
      let sensing: Sensing;
      let parameter: Parameter;
      let property: string;
      let unit: string;

      let min: number;
      let max: number;

      objByProjectId['filters'] = {};
      for (let i = 0; i < deploymentDetailsByProjectId.length; i++) {
        deployment = deploymentDetailsByProjectId[i];
        deploymentId = deployment.id;
        objByProjectId[deployment.id] = {
          meta: {
            lng: deployment.location.lng,
            lat: deployment.location.lat
            // 'hue' missing
          }
        };

        let k = 0;
        for (let j = 0; j < deployment.motestackId.sensing.length; j++) {
          sensing = deployment.motestackId.sensing[j];

          for (k; k < sensing.parameters.length; k++) {
            parameter = sensing.parameters[k];
            property = parameter.parameter.property;
            unit = parameter.parameter.unit;
            min = parameter.parameter.min;
            max = parameter.parameter.max;
            if (!(property in objByProjectId['filters'])) {
              objByProjectId['filters'][property] = {
                property: property,
                unit: unit,
                min: min,
                max: max
              };
            } else {
              if (objByProjectId['filters'][property].min > min) {
                objByProjectId['filters'][property].min = min;
              }
              if (objByProjectId['filters'][property].max < max) {
                objByProjectId['filters'][property].max = max;
              }
            }

            if (!(property in objByProjectId[deployment.id])) {
              objByProjectId[deployment.id][property] = {
                parameterPosition: [],
                parameterIds: []
              };
            }
            objByProjectId[deployment.id][property].parameterPosition.push(k);
            objByProjectId[deployment.id][property].parameterIds.push(parameter.parameter.id);
          }
        }
      }
      this.deploymentDataMetadataIndex[projectId] = objByProjectId;
    }

    this.observeDeploymentDataMetadataIndex.next(this.deploymentDataMetadataIndex);
    this.saveLocalStorage('intelligentriver.org-deploymentDataMetadataIndex', this.deploymentDataMetadataIndex);

    console.log('Intelligent River Service: deploymentDataMetadataIndex updated and locally saved', this.deploymentDataMetadataIndex);
  }

  addDeploymentsByProjectId(projectId, newDeploymentsByProjectId): void {
    if (projectId in this.deploymentsByProjectId) {
      return;
    }
    // this.observeDeploymentsByProjectId.next(null);
    this.deploymentsByProjectId[projectId] = newDeploymentsByProjectId;
    this.observeDeploymentsByProjectId.next(this.deploymentsByProjectId);
    this.saveLocalStorage('intelligentriver.org-deploymentsByProjectId', this.deploymentsByProjectId);

    console.log('Intelligent River Service: deploymentsByProjectId updated and locally saved', this.deploymentsByProjectId);
  }

  addDeploymentDetailsByProjectId(projectId, expandedDeployments) {
    if (projectId in this.deploymentDetailsByProjectId) {
      return;
    }
    // this.observeDeploymentsByProjectId.next(null);
    this.deploymentDetailsByProjectId[projectId] = expandedDeployments;
    this.observeDeploymentDetailsByProjectId.next(this.deploymentDetailsByProjectId);
    this.saveLocalStorage('intelligentriver.org-deploymentDetailsByProjectId', this.deploymentDetailsByProjectId);

    console.log('Intelligent River Service: deploymentDetailsByProjectId updated and locally saved',
      this.deploymentDetailsByProjectId);
  }

  addDeploymentDetailsByDeploymentId(deploymentId, newDeploymentDetails: DeploymentDetails): void {
    if (deploymentId in this.deploymentDetailsByDeploymentId && 'parameters' in newDeploymentDetails ) {
      return;
    } else {
      const parameters: Parameter[] = [];
      for (let i = 0; i < newDeploymentDetails.motestackId.sensing.length; i ++) {
        for (let j = 0; j < newDeploymentDetails.motestackId.sensing[i].parameters.length  ; j++) {
          parameters.push(newDeploymentDetails.motestackId.sensing[i].parameters[j]);
        }
      }
      newDeploymentDetails['parameters'] = parameters;
    }
    // this.observeDeploymentsByProjectId.next(null);
    this.deploymentDetailsByDeploymentId[deploymentId] = newDeploymentDetails;
    this.observeDeploymentDetailsByDeploymentId.next(this.deploymentDetailsByDeploymentId);
    this.saveLocalStorage('intelligentriver.org-deploymentDetailsByDeploymentId', this.deploymentDetailsByDeploymentId);

    console.log('Intelligent River Service: deploymentDetailsByDeploymentId updated and locally saved',
      this.deploymentDetailsByDeploymentId);
  }

  getStatistics(): Observable<Statistics> {
    // https://stackoverflow.com/questions/44682115/angular-4-http-service-cache
    // https://stackoverflow.com/questions/41554156/angular-2-cache-observable-http-result-data
    // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-create

    // getting rid of caching so as to force new data each time
    // if (this.statistics) {
    //   console.log('Intelligent River Service: calling getStatistics() );
    //   return Observable.create((observable) => {
    //     observable.next(this.statistics.statistics);
    //     observable.complete();
    //   });
    // }
    console.log('Intelligent River Service: getStatistics() new HTTP Request');
    return this.http.get('/api/statistics', {
      headers: this.headers
    }).map(
      ( response: StatisticsJSON) => {
        this.setStatistics(response);
        this.saveLocalStorage('intelligentriver.org-statistics', this.statistics);
        console.log('Intelligent River Service: getStatistics() resopnse', response);
        return response.statistics;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getProjects(): Observable<Project[]> {
    if (!this.projects) {
      this.projects = this.loadSpecificStorage('intelligentriver.org-projects');
    }

    if (this.projects) {
      console.log('Intelligent River Service: getProjects() cache', this.projects);
      this.setProjects(this.projects);   // trigger Subject
      return Observable.create((observable) => {  // if they're subscribing to the method
        observable.next(this.projects.projects);
        observable.complete();
      });
    }

    console.log('Intelligent River Service: getProjects() new HTTP Request');
    return this.http.get('/api/projects', {
      headers: this.headers
    }).map(
      ( response: ProjectsJSON ) => {
        this.setProjects(response);
        this.saveLocalStorage('intelligentriver.org-projects', this.projects);
        console.log('Intelligent River Service: getProjects() response', response);
        return response.projects;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  postDeployment(deployment: Deployment, token: string): Observable<any> {
    const body = {token: token, motestackId: deployment.motestackId, projectId: deployment.projectId,
        active: deployment.active, location: deployment.location, label: deployment.label};
    return this.http.post('/api/postDeployment', JSON.stringify(body), {
      headers: this.headers
    }).map(
      ( response: any ) => {
         if(response.status === 'success') {
          this.deployments = this.loadSpecificStorage('intelligentriver.org-deployments');
          if (this.deployments) {
            this.deployments.deployments.push(deployment);
            this.setAllDeployments(this.deployments);   // trigger Subject
            }
        return response;
        }
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  updateDeployment(deployment: Deployment, token: string): Observable<any> {
    const body = {token: token, id: deployment.id, motestackId: deployment.motestackId, projectId: deployment.projectId,
        active: deployment.active, location: deployment.location, label: deployment.label};
    return this.http.post('/api/updateDeployment', JSON.stringify(body), {
      headers: this.headers
    }).map(
      ( response: any ) => {
        if(response.status === 'success') {
          this.deployments = this.loadSpecificStorage('intelligentriver.org-deployments');
          if (this.deployments) {
            const updateDeployment = this.deployments.deployments.find(i => i.id === deployment.id);
            this.deployments.deployments[this.deployments.deployments.indexOf(updateDeployment)] = deployment;
            this.setAllDeployments(this.deployments);   // trigger Subject
            }
        }
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  postRadio(radio: Radio, token: string): Observable<any> {
    const body = {token: token, label: radio.label, options: radio.options};
    return this.http.post('/api/postRadio', JSON.stringify(body), {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  updateRadio(radio: Radio, token: string): Observable<any> {
    const body = {token: token, id: radio.id, label: radio.label, options: radio.options};
    return this.http.post('/api/updateRadio', JSON.stringify(body), {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDeploymentsForm(): Observable<DeploymentsForm> {
    return this.http.get('/api/deploymentsForm', {
      headers: this.headers
    }).map(
      ( response: DeploymentsForm ) => {
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDeploymentsFormByProjectId(projectId: number): Observable<DeploymentsForm> {
    console.log('Intelligent River Service: calling getDeploymentsFormByProjectId()');
    if (!this.deploymentsFormByProjectId) {
      this.deploymentsFormByProjectId = this.loadSpecificStorage('intelligent-river-deploymentsFormByProjectId');
    } else {
      if (projectId in this.deploymentsFormByProjectId) {
        console.log('Intelligent River Service: calling getDeploymentsFormByProjectId() from memory',
          projectId, this.deploymentsFormByProjectId);
        this.addDeploymentsFormByProjectId(projectId, this.deploymentsFormByProjectId);   // trigger Subject
        return Observable.create((observable) => {  // if they're subscribing to the method
          observable.next(this.deploymentsFormByProjectId);
          observable.complete();
        });
      }
    }
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/deploymentsForm', {
      headers: this.headers,
      params: params
    }).map(
      ( response: DeploymentsForm ) => {
        console.log('inside deploymentsForm by project Id', projectId, response);
        this.addDeploymentsFormByProjectId(projectId, response);
        this.saveLocalStorage('intelligent-river-deploymentsFormByProjectId', this.deploymentsFormByProjectId);
        return this.deploymentsFormByProjectId;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

   addDeploymentsFormByProjectId(projectId, newDeploymentsFormByProjectId): void {
    if (projectId in this.addDeploymentsFormByProjectId) {
      return;
    }
    this.deploymentsFormByProjectId[projectId] = newDeploymentsFormByProjectId;
    this.observeDeploymentsFormByProjectId.next(this.deploymentsFormByProjectId);
    console.log('trying to save deploymentsFormByProjectId local storage', this.deploymentsFormByProjectId);
    this.saveLocalStorage('intelligent-river-deploymentsFormByProjectId', this.deploymentsFormByProjectId);
    console.log('Intelligent River Service: deploymentsFormByProjectId updated', this.deploymentsFormByProjectId);
  }

  getRadios(): Observable<Radio[]> {
    return this.http.get('/api/radios', {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response.radios;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

   getTemplates(): Observable<SensingTemplate[]> {
    return this.http.get('/api/sensingTemplates', {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response.sensingTemplates;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getTemplatesForm(): Observable<Device[]> {
    return this.http.get('/api/sensingTemplatesForm', {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response.sensingDevices;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  updateSensingTemplate(id:string, label: string, sensingDevice: string,
      params: string[], contexts: string[], token: string): Observable<any> {
      const body = JSON.stringify({ 
        id: id,
        label : label,
        sensingDevice: sensingDevice,
        params: params,
        contexts: contexts,
        token : token
      });
      return this.http.post('/api/updateSensingTemplate', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

    postSensingTemplate(label: string, sensingDevice: string,
      params: string[], contexts: string[], token: string): Observable<any> {
      const body = JSON.stringify({ 
        label : label,
        sensingDevice: sensingDevice,
        params: params,
        contexts: contexts,
        token : token
      });
      return this.http.post('/api/postSensingTemplate', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

  getSensingDevices(): Observable<Device[]> {
    return this.http.get('/api/sensingDevices', {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response.sensingDevices;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

    postSensor(label: string, token: string): Observable<any> {
      const body = JSON.stringify({ 
        token : token,
        label : label
      });
      return this.http.post('/api/postSensor', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

    postProperty(label: string,uriSuffix: string, token: string): Observable<any> {
      const body = JSON.stringify({ 
        label: label,
        uriSuffix: uriSuffix,
        token: token
      });
      return this.http.post('/api/postProperty', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

    postUnit(label: string,uri: string, token: string): Observable<any> {
      const body = JSON.stringify({ 
        label: label,
        uri: uri,
        token: token
      });
      return this.http.post('/api/postUnit', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

    postSubject(label: string,uriSuffix: string, token: string): Observable<any> {
      const body = JSON.stringify({ 
        label: label,
        uriSuffix: uriSuffix,
        token: token
      });
      return this.http.post('/api/postSubject', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

  updateSensingDevice(device: Device, token: string): Observable<any> {
    const body = JSON.stringify({ 
        id: device.id,
        label: device.label,
        type: device.type,
        params: device.params,
        token: token
      });
      return this.http.post('/api/updateSensingDevice', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

  postSensingDevice(device: Device, token: string): Observable<any> {
    const body = JSON.stringify({ 
        label: device.label,
        type: device.type,
        params: device.params,
        token: token
      });
      return this.http.post('/api/postSensingDevice', body, {
        headers: this.headers
      }).map(
        ( response: any ) => {
          return response;
        }
      ).catch(
        ( error: HttpErrorResponse ) => {
          return Observable.throw(error);
        }
      );
  }

  getSensingDevicesForm() : Observable<DeviceForm> {
    return this.http.get('/api/sensingDevicesForm' , {
      headers: this.headers
    }).map(
      (response: any) => {
        return response
      }
    ).catch(
    (error: HttpErrorResponse) => {
      return Observable.throw(error);
    });
  }

  getMotestacks(): Observable<Motestack[]> {
    if (!this.motestacks) {
      this.motestacks = this.loadSpecificStorage('intelligen-river-motestacks');
    }

    if (this.motestacks) {
      console.log('Intelligent River Service: getMotestacks() cache', this.motestacks);
      this.setAllMotestacks(this.motestacks);   // trigger Subject
      return Observable.create((observable) => {  // if they're subscribing to the method
        observable.next(this.motestacks);
        observable.complete();
      });
    }

    console.log('Intelligent River Service: getMotestacks() new HTTP Request');
    return this.http.get('/api/motestacks', {
      headers: this.headers
    }).map(
      ( response: any ) => {
        this.setAllMotestacks(response.motestacks);
        this.saveLocalStorage('intelligen-river-motestacks', this.motestacks);
        return response.motestacks;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

   setAllMotestacks(motestacks: Motestack[]): void {
    // this.observeDeployments.next(null);
    this.motestacks = motestacks;
    this.observeMotestacks.next(this.motestacks);
    this.saveLocalStorage('intelligen-river-motestacks', this.motestacks);

    console.log('Intelligent River Service: motestacks updated and locally saved', this.motestacks);
  }

  getMotestacksForm(): Observable<MotestackForm> {
    return this.http.get('/api/motestacksForm', {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response;
      }).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      });
  }


  getDeployments(): Observable<Deployment[]> {
    if (!this.deployments) {
      this.deployments = this.loadSpecificStorage('intelligentriver.org-deployments');
    }

    this.deployments = this.loadSpecificStorage('intelligentriver.org-deployments');
    if (this.deployments) {
      console.log('Intelligent River Service: getDeployments() cache', this.deployments);
      this.setAllDeployments(this.deployments);   // trigger Subject
      return Observable.create((observable) => {  // if they're subscribing to the method
        observable.next(this.deployments.deployments);
        observable.complete();
      });
    }

    console.log('Intelligent River Service: getDeployments() new HTTP Request');
    return this.http.get('/api/deploymentsAll', {
      headers: this.headers
    }).map(
      ( response: DeploymentsAllJSON ) => {
        this.setAllDeployments(response);
        this.saveLocalStorage('intelligentriver.org-deployments', this.deployments);
        return response.deployments;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDeploymentsByProjectId(projectId: number): Observable<Deployment[]> {
    if (!this.deploymentsByProjectId) {
      this.deploymentsByProjectId = this.loadSpecificStorageAsDict('intelligentriver.org-deploymentsByProjectId');
    }

    if (this.deploymentsByProjectId) {
      if (projectId in this.deploymentsByProjectId) {
        console.log('Intelligent River Service: getDeploymentsByProjectId(' + projectId + ') cache', this.deploymentsByProjectId);
        this.addDeploymentsByProjectId(projectId, this.deploymentsByProjectId);   // trigger Subject
        return Observable.create((observable) => {  // if they're subscribing to the method
          observable.next(this.deploymentsByProjectId);
          observable.complete();
        });
      }
    }

    console.log('Intelligent River Service: getDeploymentsByProjectId(' + projectId + ') new HTTP Request');
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/deployments', {
      headers: this.headers,
      params: params
    }).map(
      ( response: DeploymentsByProjectIdJSON ) => {
        console.log('inside getDeployments by project Id', projectId, response);
        this.addDeploymentsByProjectId(projectId, response.deployments);
        this.saveLocalStorage('intelligentriver.org-deploymentsByProjectId', this.deploymentsByProjectId);
        return this.deploymentsByProjectId;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDeploymentDetailsByProjectId(projectId: number): Observable<{}> {
    if (!this.deploymentDetailsByDeploymentId) {
      this.deploymentDetailsByDeploymentId = this.loadSpecificStorageAsDict('intelligentriver.org-deploymentDetailsByProjectId');
    }

    if (this.deploymentDetailsByDeploymentId) {
      if (projectId in this.deploymentDetailsByProjectId) {
        console.log('Intelligent River Service: getDeploymentDetailsByProjectId(' + projectId + ') cache',
          this.deploymentDetailsByDeploymentId);
        // this.addDeploymentDetailsByDeploymentId(projectId, this.deploymentDetailsByProjectId);   // trigger Subject
        this.observeDeploymentDetailsByProjectId.next(this.deploymentDetailsByProjectId);
        return Observable.create((observable) => {  // if they're subscribing to the method
          observable.next(this.deploymentDetailsByProjectId);
          observable.complete();
        });
      }
    }

    console.log('Intelligent River Service: getDeploymentDetailsByProjectId(' + projectId + ')');
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/deploymentsExpanded', {
      headers: this.headers,
      params: params
    }).map(
      ( response: any ) => {
        this.addDeploymentDetailsByProjectId(projectId, response);
        console.log('here 0');
        this.addDeploymentDataMetadataIndexByProjectId(projectId, response['deployments']);
        for (let i = 0; i < response['deployments'].length; i++) {
          this.addDeploymentDetailsByDeploymentId(response['deployments'][i]['id'], response['deployments'][i]);
        }
        this.saveLocalStorage('intelligentriver.org-deploymentDetailsByProjectId', this.deploymentDetailsByProjectId);
        return this.deploymentDetailsByProjectId;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDeploymentDetailsByDeploymentId(deploymentId: string): Observable<DeploymentDetailsByDeploymentId> {
    if (!this.deploymentDetailsByDeploymentId) {
      this.deploymentDetailsByDeploymentId = this.loadSpecificStorageAsDict('intelligentriver.org-deploymentDetailsByDeploymentId');
    }

    if (this.deploymentDetailsByDeploymentId) {
      if (deploymentId in this.deploymentDetailsByDeploymentId) {
        console.log('Intelligent River Service: getDeploymentDetailsByDeploymentId(' + deploymentId + ') cache',
          this.deploymentDetailsByDeploymentId);
          // this.addDeploymentDetailsByDeploymentId(deploymentId, this.deploymentDetailsByDeploymentId);   // trigger Subject
        return Observable.create((observable) => {  // if they're subscribing to the method
          observable.next(this.deploymentDetailsByDeploymentId);
          observable.complete();
        });
      }
    }

    console.log('Intelligent River Service: getDeploymentDetailsByDeploymentId(' + deploymentId + ')');
    const params = new HttpParams().set('deploymentId', '' + deploymentId);
    return this.http.get('/api/deploymentDetails', {
      headers: this.headers,
      params: params
    }).map(
      ( response: any ) => {
        console.log('inside getDeploymentDetailsByDeploymentId()', deploymentId, response);
        this.addDeploymentDetailsByDeploymentId(deploymentId, response['deployment']);
        this.saveLocalStorage('intelligentriver.org-deploymentDetailsByDeploymentId', this.deploymentDetailsByDeploymentId);
        return this.deploymentDetailsByDeploymentId;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDiagnostics(projectId): Observable<DiagnosticsJSON> {
    console.log('Intelligent River Service: getDiagnostics(' + projectId + ') new HTTP Request');
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/diagnostics', {
      headers: this.headers,
      params: params
    }).map(
      ( response: DiagnosticsJSON ) => {
        let diagnostics: Diagnostics;
        for (let i = 0; i < response.diagnostics.length; i++) {
          diagnostics = response.diagnostics[i];
          Object.keys(this.deploymentDetailsByDeploymentId).forEach(deploymentId => {
            if (this.deploymentDetailsByDeploymentId[deploymentId].motestackId.uri === diagnostics.deployment) {
              response.diagnostics[i].deployment = deploymentId;
            }
          });
        }
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  findDiagnosticName(deploymentUri: string): string {
    let deployment: DeploymentDetails;
    for (let i = 0; i < this.deploymentDetailsByProjectId[this.currentProject.id].length; i++) {
      deployment = this.deploymentDetailsByProjectId[this.currentProject.id][i];
      console.log('diagnostic', deployment, deploymentUri);
      if (deployment.motestackId.uri === deploymentUri) {
        return deployment.label;
      }
    }
    return deploymentUri;
  }

  getMaintenanceByProjectId(projectId: number): Observable<Maintenance[]> {
    // if (!this.maintenanceByProjectId) {
    //   this.maintenanceByProjectId = this.loadSpecificStorage('intelligentriver.org-maintenanceByProjectId');
    // } else {
    //   if (projectId in this.maintenanceByProjectId) {
    //     console.log('Intelligent River Service: calling getMaintenanceByProjectId() from memory',
    // projectId, this.maintenanceByProjectId);
    //     this.addMaintenanceByProjectId(projectId, this.maintenanceByProjectId);   // trigger Subject
    //     return Observable.create((observable) => {  // if they're subscribing to the method
    //       observable.next(this.maintenanceByProjectId);
    //       observable.complete();
    //     });
    //   }
    // }

    console.log('Intelligent River Service: calling getMaintenanceByProjectId(' + projectId + ') new HTTP Request');
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/maintenance', {
      headers: this.headers,
      params: params
    }).map(
      ( response: MaintenanceAllJSON ) => {
        console.log('inside getMaintenance by project Id', projectId, response);
        this.addMaintenanceByProjectId(projectId, response.maintenance);
        this.saveLocalStorage('intelligentriver.org-maintenanceByProjectId', this.maintenanceByProjectId);
        return this.maintenanceByProjectId;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  addMaintenanceByProjectId(projectId, newMaintenanceByProjectId): void {
    if (projectId in this.addMaintenanceByProjectId) {
      return;
    }
    // this.observeMaintenanceByProjectId.next(null);
    this.maintenanceByProjectId[projectId] = newMaintenanceByProjectId;
    this.observeMaintenanceByProjectId.next(this.maintenanceByProjectId);
    // console.log('trying to save MaintenanceByProjectId local storage', this.maintenanceByProjectId);
    // this.saveLocalStorage('intelligentriver.org-maintenanceByProjectId', this.maintenanceByProjectId);
    // console.log('Intelligent River Service: maintenanceByProjectId updated', this.maintenanceByProjectId);
  }

  getMaintenanceFormData(projectId: number): Observable<any> {
    console.log('Intelligent River Service: getMaintenanceFormData(' + projectId + ') new HTTP Request');
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/maintenanceForm', {
        headers: this.headers,
        params: params
    }).map(
      ( response: any) => {
          console.log('Intelligent River Service: getMaintenanceFormData(' + projectId + ') response', response);
          return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
          console.log('Intelligent River Service: getMaintenanceFormData(' + projectId + ') Error!', error);
          return Observable.throw(error);
      }
    );
  }

  postMaintenanceData(maintenance: Maintenance, token: string): Observable<any> {
    let maintenancePost: any;
    maintenancePost = maintenance;
    maintenancePost.token = token;
    const body = JSON.stringify({
      datetime: maintenancePost.datetime,
      comment: maintenancePost.comment,
      deployment: maintenancePost.deployment,
      eventType: maintenancePost.eventType,
      projectId: maintenancePost.projectId,
      token: maintenancePost.token,
      user: maintenancePost.user
    });
    return this.http.post('/api/postMaintenance', body, {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  deleteMaintenance(token: string, maintenanceId: string) {
    console.log('Intelligent River Service: deleteMaintenance called, maintenanceId, token: ', maintenanceId, token);
    const body = JSON.stringify({
      token: token,
      maintenanceId: maintenanceId
    });
    console.log('irs delete method body: ',);
    return this.http.post('/api/deleteMaintenance', body, {
      headers: this.headers
    }).map(
      ( response: any ) => {
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  getDataCurrent(projectId: number): Observable<any> {
    console.log('Intelligent River Service: getDataCurrent(' + projectId + ') new HTTP Request');
    const params = new HttpParams().set('projectId', '' + projectId).set('date', '01-20-2017');
    // return this.http.get('/api/dataRecent', {
    return this.http.get('/api/dataArchive', {
      headers: this.headers,
      params: params
    }).map(
      ( response: DataTemporaryJSON) => {
        console.log('Intelligent River Service: getDataCurrent(' + projectId + ') response', response);
        return this.temporaryDataCurrentSorting(response);
        // return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        console.log('Intelligent River Service: getDataCurrent(' + projectId + ') ERROR!!!!!', error);
        return Observable.throw(error);
      }
    );
  }

  temporaryDataCurrentSorting(response: DataTemporaryJSON): {} {
    const tempDataSort = {};
    const data = response.data;
    let datum: DataTemporary;
    const ret: {} = {};
    for (let i = 0; i < data.length; i ++) {
      datum = data[i];
      if (datum.deploymentId in tempDataSort) {
        if (datum.observationDateTime > tempDataSort[datum.deploymentId]['observationDateTime']) {
          tempDataSort[datum.deploymentId] = datum;
        }
      } else {
        tempDataSort[datum.deploymentId] = datum;
      }
    }

    return tempDataSort;
  }

  /*
  params:
    deploymentId: string
    begin: moment.js
    end: moment.js
  returns:
    Observable<any>: RxJS.js
  */
  // getDataHistorical(deploymentId: string, start: Date, finish: Date): Observable<any> {
  getDataHistorical(deploymentId: string, start: string): Observable<any> {
    console.log('Intelligent River Service: getDataHistorical(' + deploymentId + ', ' + start + ') new HTTP Request');
    let projectId = '5';
    if (deploymentId in this.deploymentDetailsByDeploymentId) {
      projectId = this.deploymentDetailsByDeploymentId[deploymentId]['projectId'];
    } else {
      console.log('Intelligent River Service: getDataHistorical(' + deploymentId + ', ' + start + ') ERROR!!!!');
      return Observable.throw('fack');
    }

    const params = new HttpParams().set('projectId', '' + projectId).set('date', '01-20-2017');
    // return this.http.get('/api/dataRecent', {
    return this.http.get('/api/dataArchive', {
      headers: this.headers,
      params: params
    }).map(
      ( response: DataTemporaryJSON) => {
        console.log('Intelligent River Service: getDataHistorical(' + deploymentId + ', ' + start + ') response');
        return this.temporaryDataHistoricalSorting(deploymentId, response);
        // return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        console.log('Intelligent River Service: getDataCurrent(' + projectId + ') ERROR!!!!!', error);
        return Observable.throw(error);
      }
    );
  }

  temporaryDataHistoricalSorting(deploymentId: string, response: DataTemporaryJSON): {} {
    const tempDataSort = {};
    const data = response.data;
    let datum: DataTemporary;
    const ret: {} = {};
    for (let i = 0; i < data.length; i ++) {
      datum = data[i];
      if (datum.deploymentId === deploymentId) {
        if (!(datum.deploymentId in tempDataSort)) {
          tempDataSort[datum.deploymentId] = [];
        }
        tempDataSort[datum.deploymentId].push(datum);
      }
    }

    Object.keys(tempDataSort).forEach(deploymentId2 => {
      tempDataSort[deploymentId2].sort((left, right) => {
        if (left['observationDateTime'] < right['observationDateTime']) {
          return -1;
        } else if (left['observationDateTime'] > right['observationDateTime']) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    return tempDataSort;
  }

  getStatusByProjectId(projectId: number): Observable<StatusJSON> {
    console.log('Intelligent River Service: getStatusByProjectId(' + projectId + ') new HTTP Request');
    const params = new HttpParams().set('projectId', '' + projectId);
    return this.http.get('/api/status', {
      headers: this.headers,
      params: params
    }).map(
      ( response: StatusJSON ) => {
        response = this.transformStatusDates(response);
        return response;
      }
    ).catch(
      ( error: HttpErrorResponse ) => {
        return Observable.throw(error);
      }
    );
  }

  transformStatusDates(data: StatusJSON): StatusJSON {
    let deployment: DeploymentDetails;
    let lastMessage: ObservationMessage;
    let messageBaseDateTime: string;
    let messageOffsetTime: number;
    let newTime: number;
    for (let i = 0; i < data.statuses.length; i++) {
      deployment = data.statuses[i].deployment;
      lastMessage = data.statuses[i].lastMessage.diagnostics;
      messageBaseDateTime = lastMessage.baseDateTime;
      messageOffsetTime = lastMessage.offsetTime;
      newTime = moment(messageBaseDateTime).valueOf();
      console.log('status', newTime, messageOffsetTime * 1000);
      newTime = newTime + messageOffsetTime * 1000;
      lastMessage.baseDateTime = moment(newTime).format('MM-DD-YYYY HH:mm:ss');   // .toISOString();
      console.log('status', lastMessage.baseDateTime, newTime);
    }
    data = this.transformSampleDates(data);

    return data;
  }

  transformSampleDates(data: StatusJSON): StatusJSON {
    let lastMessage: MoteStackMessage;
    let messageBaseDateTime: string;
    let messageOffsetTime: number;
    let newTime: number;
    for (let i = 0; i < data.statuses.length; i++) {
      lastMessage = data.statuses[i].lastMessage;
      if ('sdi12Samples' in lastMessage) {
        for (let j = 0; j < lastMessage.sdi12Samples.length; j++) {
          messageBaseDateTime = lastMessage.sdi12Samples[j].baseDateTime;
          messageOffsetTime = lastMessage.sdi12Samples[j].offsetTime;
          newTime = moment(messageBaseDateTime).valueOf();
          console.log('status', newTime, messageBaseDateTime);
          newTime  = newTime + messageOffsetTime * 1000;
          lastMessage.sdi12Samples[j].baseDateTime = moment(newTime).format('MM-DD-YYYY HH:mm:ss');
          console.log('status', lastMessage.sdi12Samples[j].baseDateTime, newTime);
        }
      } else if ('oneWireSamples' in lastMessage) {
        for (let j = 0; j < lastMessage.sdi12Samples.length; j++) {
          messageBaseDateTime = lastMessage.oneWireSamples[j].baseDateTime;
          messageOffsetTime = lastMessage.oneWireSamples[j].offsetTime;
          newTime = moment(messageBaseDateTime).valueOf();
          console.log('status inner', newTime, messageBaseDateTime);
          newTime  = newTime + messageOffsetTime * 1000;
          lastMessage.oneWireSamples[j].baseDateTime = moment(newTime).format('MM-DD-YYYY HH:mm:ss');
          console.log('status', lastMessage.oneWireSamples[j].baseDateTime, newTime);
        }
      } else if ('analogSamples' in lastMessage) {
        for (let j = 0; j < lastMessage.sdi12Samples.length; j++) {
          messageBaseDateTime = lastMessage.analogSamples[j].baseDateTime;
          messageOffsetTime = lastMessage.analogSamples[j].offsetTime;
          newTime = moment(messageBaseDateTime).valueOf();
          console.log('status inner', newTime, messageBaseDateTime);
          newTime  = newTime + messageOffsetTime * 1000;
          lastMessage.analogSamples[j].baseDateTime = moment(newTime).format('MM-DD-YYYY HH:mm:ss');
          console.log('status', lastMessage.analogSamples[j].baseDateTime, newTime);
        }
      }
    }

    return data;
  }

  loadLocalStorage(): void {
    const now: moment.Moment = moment();
    console.log('Intelligent River Service: now', now.toISOString());
    if (localStorage.getItem('intelligentriver.org-last-update') === null) {
      localStorage.setItem('intelligentriver.org-last-update', JSON.stringify(now.toISOString()));
    } else {
      let then: any = JSON.parse(localStorage.getItem('intelligentriver.org-last-update'));
      console.log('Intelligent River Service: last-update', then);
      then = moment(then);

      if (now.diff(then, 'hours') < 6) {
        console.log('Intelligent River Service: last update less than 6 hours, retrieving local storage');
        this.retrieveOtherStorage();
      } else {
        console.log('Intelligent River Service: outdated, resetting local storage');
        for (const key of Object.keys(this.localStorageKeys)) {
          this.clearLocalStorage(key);
        }
        localStorage.setItem('intelligentriver.org-last-update', JSON.stringify(now.toISOString()));
      }
    }
  }

  loadSpecificStorage(storageKey: string): any {
    const now = moment();
    if (localStorage.getItem('intelligentriver.org-last-update') === null) {
      localStorage.setItem('intelligentriver.org-last-update', JSON.stringify(now.toISOString()));
    } else {
      let then: any = JSON.parse(localStorage.getItem('intelligentriver.org-last-update'));
      then = moment(then);

      if (now.diff(then, 'hours') < 6) {
        const data: any = JSON.parse(localStorage.getItem(storageKey));
        return data;
      } else {
        for (const key of Object.keys(this.localStorageKeys)) {
          this.clearLocalStorage(key);
        }
        localStorage.setItem('intelligentriver.org-last-update', JSON.stringify(now.toISOString()));
      }
    }
    return null;
  }

  loadSpecificStorageAsDict(storageKey: string): any {
    const now = moment();
    if (localStorage.getItem('intelligentriver.org-last-update') === null) {
      localStorage.setItem('intelligentriver.org-last-update', JSON.stringify(now.toISOString()));
    } else {
      let then: any = JSON.parse(localStorage.getItem('intelligentriver.org-last-update'));
      then = moment(then);

      if (now.diff(then, 'hours') < 6) {
        const data: any = JSON.parse(localStorage.getItem(storageKey));
        return !data ? {} : data;
      } else {
        for (const key of Object.keys(this.localStorageKeys)) {
          this.clearLocalStorage(key);
        }
        localStorage.setItem('intelligentriver.org-last-update', JSON.stringify(now.toISOString()));
      }
    }
    return {};
  }

  retrieveOtherStorage(): void {
    let data: any;
    if (localStorage.getItem('intelligentriver.org-projects') === null) {
      this.projects = null;
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-projects'));
      this.projects = data;
    }

    if (localStorage.getItem('intelligentriver.org-statistics') === null) {
      this.statistics = null;
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-statistics'));
      this.statistics = data;
    }

    if (localStorage.getItem('intelligentriver.org-deployments') === null) {
      this.deployments = null;
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-deployments'));
      this.deployments = data;
    }

    if (localStorage.getItem('intelligentriver.org-deploymentDataMetadataIndex') === null) {
      this.deploymentDataMetadataIndex = {};
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-deploymentDataMetadataIndex'));
      this.deploymentDataMetadataIndex = data;
    }

    if (localStorage.getItem('intelligentriver.org-deploymentsByProjectId') === null) {
      this.deploymentsByProjectId = {};
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-deploymentsByProjectId'));
      this.deploymentsByProjectId = !data ? {} : data;
    }

    if (localStorage.getItem('intelligentriver.org-deploymentDetailsByProjectId') === null) {
      this.deploymentDetailsByProjectId = {};
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-deploymentDetailsByProjectId'));
      this.deploymentDetailsByProjectId = !data ? {} : data;
    }

    if (localStorage.getItem('intelligentriver.org-deploymentDetailsByDeploymentId') === null) {
      this.deploymentDetailsByDeploymentId = {};
    } else {
      data = JSON.parse(localStorage.getItem('intelligentriver.org-deploymentDetailsByDeploymentId'));
      this.deploymentDetailsByDeploymentId = !data ? {} : data;
    }

    this.observeCurrentProject.next(this.currentProject);
    this.observeProjects.next(this.projects.projects);
    this.observeCurrentDeployment.next(this.currentDeployment);
    this.observeDeployments.next(this.deployments.deployments);
    this.observeDeploymentDataMetadataIndex.next(this.deploymentDataMetadataIndex);
    this.observeDeploymentsByProjectId.next(this.deploymentsByProjectId);
    this.observeDeploymentDetailsByDeploymentId.next(this.deploymentDetailsByDeploymentId);
  }

  saveLocalStorage(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  clearLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
