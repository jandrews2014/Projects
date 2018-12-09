import * as moment from 'moment';
import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../models/user.model';

import { Project, ProjectsJSON } from '../../../models/projects.model';
import { Maintenance, MaintenanceAllJSON } from '../../../models/maintenance.model';

import { IntelligentRiverService } from '../../../services/intelligent-river.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  projects: Project[];
  ErrorMessage: string;
  maintenance: Maintenance[];
  currentMaintenance: Maintenance;
  newMaintenanceData: Maintenance;
  currentMaintenanceFormData: any;
  currentProject: Project;
  currentUser: User;
  maintenanceByProjectId: any;
  background: any;
  submitButtonText: string;

  currentProjectId: number;
  currentMaintenanceId: number;

  deploymentSelectedValue: string;
  actionTypeSelectedValue: string;
  dateTimeSelectedValue: number;
  commentEnteredValue: string;
  datetimeString: string;

  dateTimePickerValue: any;

  // detailed data view elements
  detailedDeployment: string;
  detailedActionType: string;
  detailedTimestamp: any;
  detailedComment: string;
  detailedViewId: any;
  detailedUser: string;

  constructor(private irService: IntelligentRiverService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
      this.projects = null;
      this.currentUser = null;
      this.maintenance = null;
      this.currentMaintenanceFormData = null;
      this.maintenanceByProjectId = null;
      this.submitButtonText = "Submit";
      this.currentProject = null;
      this.currentProjectId = null;
      this.ErrorMessage = " ";
      this.currentMaintenance = null;
      this.newMaintenanceData = {
          datetime: 0,
          comment: " ",
          eventType: " ",
          user: " ",
          projectId: 0,
          deployment: " ",
      };
      this.deploymentSelectedValue = null;
      this.actionTypeSelectedValue = null;
      this.dateTimeSelectedValue = null;
      this.commentEnteredValue = " ";
      this.datetimeString = null;
      this.background = 'assets/img/maintenance_bg.png';

      // detailed view data elements
      this.detailedDeployment = null;
      this.detailedActionType = null;
      this.detailedTimestamp = null;
      this.detailedComment = null;
      this.detailedViewId = null;
      this.detailedUser = null;

      this.dateTimeSelectedValue = Date.now();
      this.dateTimePickerValue = Date.now();
    }

  ngOnInit() {
    console.log('Maintenance Component Initialized');

    this.authService.observeCurrentUser.subscribe((authUser) => {
        this.currentUser = authUser;
        console.log('currentUser: ', this.currentUser);
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
      if (next) {
        this.currentProjectId = next.id;
        if (this.currentProject) {
          // grab data to populate table
          this.getTableData();
        }
      }
      console.log('Maintenance currentProject', next);
    });
  }

  getTableData() {
    this.irService.getMaintenanceByProjectId(this.currentProject.id).subscribe(
      (data) => {
        console.log('Maintenance getMaintenanceById success', data);
        console.log('data[this.currentProject.id]: ', data[this.currentProject.id]);
        this.currentMaintenance = data[this.currentProject.id];

        for (var i = 0; i < this.currentMaintenance['length']; i++){
          this.currentMaintenance[i].datetime = moment(this.currentMaintenance[i].datetime).format("DD MMM YYYY hh:mm a");
        }
      }
    );
  }

  getMaintenanceFormData() {
    this.irService.getMaintenanceFormData(this.currentProject.id).subscribe(
      (data) => {
        console.log('Maintenance getMaintenanceFormData success', data);
        this.currentMaintenanceFormData = data;
      }
    );
  }

  deploymentSelected(value) {
    this.deploymentSelectedValue = value;
  }

  actionTypeSelected(value) {
    this.actionTypeSelectedValue = value;
  }

  dateTimeSelected(value) {
    this.datetimeString = value;
    const newMoment = moment(this.datetimeString);
    const millis = newMoment.valueOf();

    this.dateTimeSelectedValue = millis;

    console.log(this.dateTimePickerValue, this.dateTimeSelectedValue);
  }

  commentEntered(value) {
    this.commentEnteredValue = value;
  }

  deleteRow() {
    this.irService.deleteMaintenance(
      this.currentUser.token, 
      this.detailedViewId.toString()
      ).subscribe(data => {
        console.log(data);
        if (data['status'] === 'success') {
          this.getTableData();
          $('#rowDetailClose').click();
        }
        else {
          this.ErrorMessage = "Something went wrong. Reload the page and try again!";
        }
      });
  }

  storeCurrentRowValues(rowContent) {
    this.detailedDeployment = rowContent.deployment;
    this.detailedActionType = rowContent.eventType;
    this.detailedTimestamp = rowContent.datetime;
    this.detailedComment = rowContent.comment;
    this.detailedViewId = rowContent.id;
    this.detailedUser = rowContent.user;
    console.log(this.detailedViewId);
  }

  onSubmit() {

    this.submitButtonText = "Pending";

    if (this.actionTypeSelectedValue == null) {
      this.actionTypeSelectedValue = this.currentMaintenanceFormData['eventTypes'][0]['label'];
    }
    if (this.deploymentSelectedValue === null) {
      this.deploymentSelectedValue = this.currentMaintenanceFormData['deployments'][0]['label'];
    }

    this.newMaintenanceData['datetime'] = this.dateTimeSelectedValue;
    this.newMaintenanceData['comment'] = this.commentEnteredValue;
    this.newMaintenanceData['eventType'] = this.actionTypeSelectedValue;
    this.newMaintenanceData['user'] = this.currentUser.username;
    this.newMaintenanceData['projectId'] = this.currentProjectId;
    this.newMaintenanceData['deployment'] = this.deploymentSelectedValue;

    console.log('submission data is set', this.newMaintenanceData);

    this.irService.postMaintenanceData(
      this.newMaintenanceData,
      this.currentUser.token
      ).subscribe(data => {
      console.log(data);
      if (data['status'] === 'success') {
        console.log('maintenance data logged successfully');
        this.submitButtonText = "Submit";
        this.getTableData();
        $("#addRowClose").click();
        this.ErrorMessage = " ";

      } else if (data['status'] === 'failure') {
        this.submitButtonText = "Submit";
        console.log('maintenance data logging failed');
        this.ErrorMessage = "Error: try reloading the page!";
      } else {
        console.log('something went wrong submitting maintenance data');
      }
    });
  }

}
