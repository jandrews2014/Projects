import { Component, OnInit } from '@angular/core';
import { Radio } from '../../../../../models/radios.model';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import { Router, Params } from '@angular/router';

@Component({
  selector: 'app-radio-list',
  templateUrl: './radio-list.component.html',
  styleUrls: ['./radio-list.component.scss']
})
export class RadioListComponent implements OnInit {
  radios: Radio[];
  filteredRadios: Radio[];
  constructor(private irService: IntelligentRiverService, private router: Router) { }

  ngOnInit() {
     this.irService.getRadios().subscribe(radios => {
      this.radios = radios;
      this.filteredRadios = Object.assign([], this.radios);
    });
  }

   filterItem(filter: string) : void {
    this.filteredRadios =  this.radios.filter(i=>i.label.toLowerCase().includes(filter.toLowerCase()));
  } 

  updateRadio(radio: Radio) :void {
     if(radio == null)
        this.router.navigate(['./deployment-manager/radios', 'new' ]);
    else this.router.navigate(['./deployment-manager/radios', radio.id ]);
  }

}
