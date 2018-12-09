import { Component, OnInit } from '@angular/core';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import { Router, Params } from '@angular/router';
import { Device } from '../../../../../models/device.model'; 

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Device[];
  filteredDevices: Device[];
  constructor(private irService: IntelligentRiverService, private router: Router) { }

  ngOnInit() {
    this.irService.getSensingDevices().subscribe(devices => {
      this.devices = devices;
      this.filteredDevices = Object.assign([], this.devices);
    });
  }

    filterItem(filter: string) : void {
      this.filteredDevices =  this.devices.filter(i=>i.label.toLowerCase().includes(filter.toLowerCase()));
  } 

  updateDevice(device: Device) :void {
     if(device == null)
        this.router.navigate(['./deployment-manager/devices', 'new' ]);
    else this.router.navigate(['./deployment-manager/devices', device.id ]);
  }

}
