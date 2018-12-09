import { Component, OnInit} from '@angular/core';
import { Deployment } from '../../../../../models/deployments.model';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import { Router, Params } from '@angular/router';

@Component({
  selector: 'app-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss']
})
export class DeploymentListComponent implements OnInit {
  deployments: Deployment[];
  filteredDeployments: Deployment[];
  constructor(private irService: IntelligentRiverService, private router: Router) {
   }

  ngOnInit() {
    this.irService.getDeployments().subscribe(deployments => {
      this.deployments = deployments;
      this.filteredDeployments = Object.assign([], this.deployments);
    });
  }

  filterItem(filter: string) : void {
    this.filteredDeployments =  this.deployments.filter(i=>i.label.toLowerCase().includes(filter.toLowerCase()));
  } 

  updateDeployment(deployment: Deployment) :void {
     if(deployment == null)
        this.router.navigate(['./deployment-manager/deployments', 'new' ]);
    else this.router.navigate(['./deployment-manager/deployments', deployment.id ]);
  }

}
