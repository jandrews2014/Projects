import { Component, OnInit } from '@angular/core';
import { SensingTemplate, TemplateParams } from '../../.././../../models/template.model';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import {ActivatedRoute} from '@angular/router';
import { User } from '../../../../..//models/user.model';
import { AuthService } from '../../../../../services/auth.service';
import { Device } from '../../../../../models/device.model';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {
  templateId: string;
  template: SensingTemplate;
  sensingDevices: Device[];
  private currentUser: User;
  selectedParamId: string;
  availableToAddParams: TemplateParams[];

  constructor(private irService: IntelligentRiverService, private route:ActivatedRoute,private authService: AuthService) {
   }

  ngOnInit() {
     this.templateId = this.route.snapshot.params['id'];
     if(this.templateId != 'new') {
         this.irService.getTemplates().subscribe(templates => {
            this.template = templates.find(i=> i.id == this.templateId);
            this.availableToAddParams = Object.assign([], this.template.params);
          });
      } else {
        this.template = {};
        this.template.sensingDevice = {};
        this.template.params = [];
      }

      this.authService.observeCurrentUser.subscribe((next) => {
        this.currentUser = next;
      });

      this.irService.getTemplatesForm().subscribe(sensingDevices => {
        this.sensingDevices = sensingDevices.filter(i=> i.type === "SDI12");
      });

  }
    addParam() {
      let selectedParam = this.availableToAddParams.find(i=>i.id == this.selectedParamId);
      if(selectedParam)
          this.template.params.push(selectedParam);
    }
    removeParam(indx: number) {
         this.template.params.splice(indx, 1);
    }

    updateEntity() {
      if(this.templateId !== 'new') 
        this.irService.updateSensingTemplate(this.template.id, this.template.label, this.template.sensingDevice.label,
        this.template.params.map(i=>i.label), this.template.params.map(i=>i.context), this.currentUser.token).subscribe(res => {
        });
        else 
        this.irService.postSensingTemplate(this.template.label, this.template.sensingDevice.label,
        this.template.params.map(i=>i.label), this.template.params.map(i=>i.context), this.currentUser.token).subscribe(res => {
        });
    }

    changeDeviceParams(val) {
      this.availableToAddParams = this.sensingDevices.find(i=>i.id == this.template.sensingDevice.id).params;
      this.template.sensingDevice.label = this.sensingDevices.find(i=>i.id== this.template.sensingDevice.id).params.map(i=>i.label)[0];
    }

}
