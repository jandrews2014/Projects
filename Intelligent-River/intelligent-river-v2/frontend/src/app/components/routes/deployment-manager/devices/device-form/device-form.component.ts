import { Component, OnInit } from '@angular/core';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import {ActivatedRoute} from '@angular/router';
import { User } from '../../../../..//models/user.model';
import { AuthService } from '../../../../../services/auth.service';
import { Device, DeviceForm } from '../../.././../../models/device.model';
import { PostSensingDeviceParameter } from '../../../../../models/motestack.model';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
  private currentUser: User;
  deviceId: string;
  device: Device; 
  deviceForm: DeviceForm;
  editingParam: PostSensingDeviceParameter;

  constructor(private irService: IntelligentRiverService, private route:ActivatedRoute,private authService: AuthService) { }

  ngOnInit() {
     this.deviceId = this.route.snapshot.params['id'];
     if(this.deviceId != 'new') {
         this.irService.getSensingDevices().subscribe(devices => {
            this.device = devices.find(i=> i.id == this.deviceId);
          });
      } else {
        this.device = {};
        this.device.params = [];
      }
      this.authService.observeCurrentUser.subscribe((next) => {
        this.currentUser = next;
      });

      this.irService.getSensingDevicesForm().subscribe(deviceForm => {
        this.deviceForm = deviceForm;
      });
  }

  removeParam(index) {
    this.device.params = this.device.params.filter((item,inx) => inx != index);
  }

  addParam() {
    this.device.params.push({});
  }

  showNewSensorModal(editingParam: PostSensingDeviceParameter){
    this.editingParam = editingParam;
    (<any>$('#newSensorModal')).modal('show');
  }

  showNewSubjectModal(editingParam: PostSensingDeviceParameter){
    this.editingParam = editingParam;
    (<any>$('#newSubjectModal')).modal('show');
  }

  showNewPropertyModal(editingParam: PostSensingDeviceParameter){
    this.editingParam = editingParam;
    (<any>$('#newPropertyModal')).modal('show');
  }

  showNewUnitModal(editingParam: PostSensingDeviceParameter){
     this.editingParam = editingParam;
     (<any>$('#newUnitModal')).modal('show');
  }

  addNewSensor(labelInput: HTMLInputElement) {
    let label = labelInput.value;
    labelInput.value = '';
    this.irService.postSensor(label, this.currentUser.token).subscribe(res => {
      
      if(res.status === 'success') {
        this.deviceForm.sensors.push({label: label});
        this.editingParam.sensor = label;
        (<any>$('#newSensorModal')).modal('hide');
      }
    });
    
  }

  addNewSubject(labelInput: HTMLInputElement, uriSuffixInput: HTMLInputElement) {
    let label = labelInput.value;
    let uriSufix = uriSuffixInput.value;
    this.irService.postSubject(label, uriSufix, this.currentUser.token).subscribe(res => {

      if(res.status === 'success') {
        this.deviceForm.subjects.push({label: label, uriSuffix: uriSufix});
        this.editingParam.subject = label;
        labelInput.value = '';
        uriSuffixInput.value = '';
        (<any>$('#newSubjectModal')).modal('hide');
      }
    });
  
  }

  addNewProperty(labelInput: HTMLInputElement, uriSuffixInput: HTMLInputElement) {
    let label = labelInput.value;
    let uriSufix = uriSuffixInput.value;
    this.irService.postProperty(label, uriSufix, this.currentUser.token).subscribe(res => {

      if(res.status === 'success') {
        this.deviceForm.properties.push({label: label, uriSuffix: uriSufix});  
        this.editingParam.property = label;
        labelInput.value = '';
        uriSuffixInput.value = '';
        (<any>$('#newPropertyModal')).modal('hide');
      }
    });
   
  }

   addNewUnit(labelInput: HTMLInputElement, uriInput: HTMLInputElement) {
    let label = labelInput.value;
    let uri = uriInput.value;
    this.irService.postUnit(label, uri, this.currentUser.token).subscribe(res=> {
      if(res.status === 'success') {
        this.deviceForm.units.push({label: label, uri: uri});
        this.editingParam.unit = label;
        labelInput.value = '';
        uriInput.value = '';
        (<any>$('#newUnitModal')).modal('hide');
      }
    });
  }

  updateEntity() {
    if(this.deviceId !== 'new') {
      this.irService.updateSensingDevice(this.device, this.currentUser.token).subscribe(res =>{
      });
    } 
    else {
      this.irService.postSensingDevice(this.device, this.currentUser.token).subscribe(res=> {
      });
    }
  }
  
  typeChanged(value: string) {
        this.device.params = [{}];
    switch(value) {
      case 'SDI12' :
      break;
      case 'ANALOG' :
       this.device.params[0].unit = 'raw ADC value';
       break;
      case 'ONEWIRE': 
      break;
    }
  }

}
