import { Component, OnInit } from '@angular/core';
import { SensingTemplate } from '../../../../../models/template.model';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import { Router, Params } from '@angular/router';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  templates: SensingTemplate[];
  filteredTemplates: SensingTemplate[];
  constructor(private irService: IntelligentRiverService, private router: Router) { }

  ngOnInit() {
     this.irService.getTemplates().subscribe(templates => {
      this.templates = templates;
      this.filteredTemplates = Object.assign([], this.templates);
    });
  }

  filterItem(filter: string) : void {
    this.filteredTemplates =  this.templates.filter(i=>i.label.toLowerCase().includes(filter.toLowerCase()));
  } 

  updateTemplate(template: SensingTemplate) :void {
     if(template == null)
        this.router.navigate(['./deployment-manager/templates', 'new' ]);
    else this.router.navigate(['./deployment-manager/templates', template.id ]);
  }
  

}
