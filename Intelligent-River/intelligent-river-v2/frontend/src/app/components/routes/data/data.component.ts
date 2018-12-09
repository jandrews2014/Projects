import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  selectedDataType: string;

  constructor() { }

  ngOnInit() {
    console.log('DATA.ngOnInit();');

    this.selectedDataType = 'current';
  }

  selectDataType(dataType: string) {
    this.selectedDataType = dataType;
    console.log('DATA.selectDataType(' + dataType + ');');
  }
}
