import { Component, OnInit } from '@angular/core';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import { Router, Params } from '@angular/router';
import { Motestack } from '../../../../../models/motestack.model';

@Component({
  selector: 'app-motestack-list',
  templateUrl: './motestack-list.component.html',
  styleUrls: ['./motestack-list.component.scss']
})
export class MotestackListComponent implements OnInit {
  motestacks: Motestack[];
  filteredMotestacks: Motestack[];

  constructor(private irService: IntelligentRiverService, private router: Router) { }

  ngOnInit() { 
    this.irService.getMotestacks().subscribe(motestack => {
      this.motestacks = motestack;
      this.filteredMotestacks = Object.assign([], this.motestacks);
    });
  }

  filterItem(filter: string) : void {
    this.filteredMotestacks =  this.motestacks.filter(i=>i.label.toLowerCase().includes(filter.toLowerCase()));
  } 

   updateMotestack(motestack: Motestack) :void {
     if(motestack == null)
        this.router.navigate(['./deployment-manager/motestacks', 'new' ]);
    else this.router.navigate(['./deployment-manager/motestacks', motestack.id ]);
  }

}
