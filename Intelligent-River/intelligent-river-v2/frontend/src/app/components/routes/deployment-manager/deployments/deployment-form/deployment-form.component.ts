import { Component, OnInit } from '@angular/core';
import { Deployment, DeploymentsForm } from '../../.././../../models/deployments.model';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import { AuthService } from '../../../../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import { User } from '../../../../..//models/user.model';

@Component({
  selector: 'app-deployment-form',
  templateUrl: './deployment-form.component.html',
  styleUrls: ['./deployment-form.component.scss']
})
export class DeploymentFormComponent implements OnInit {
  deploymentId: string;
  deploymentsForm: DeploymentsForm;
  deployment: Deployment;
  private currentUser: User;
  
  constructor(private irService: IntelligentRiverService, private route:ActivatedRoute,private authService: AuthService) { 
    this.deploymentsForm = {};
    this.deploymentsForm.motestacks = [];
    this.deploymentsForm.projects = [];
    this.deployment = {};
    this.deployment.location = {};
  }

  ngOnInit() {
      this.deploymentId = this.route.snapshot.params['id'];
      this.irService.getDeploymentsForm().subscribe(deploymentsForm => {
            this.deploymentsForm = deploymentsForm;
          });
      if(this.deploymentId !== 'new') {
        this.irService.getDeployments().subscribe(deployments => {
            this.deployment = deployments.find(i=> i.id == this.deploymentId);
        });
      }

    this.authService.observeCurrentUser.subscribe((next) => {
      this.currentUser = next;
    });
  }

  onSubmit() {
    if(this.deploymentId === 'new') {
      this.irService.postDeployment(this.deployment, this.currentUser.token).subscribe(res => {
      });
    }
    else {
      this.irService.updateDeployment(this.deployment, this.currentUser.token).subscribe(res => {
      })
    }
  }

}
