import { Component, OnInit , Input} from '@angular/core';
import { Template } from '../../../.././../../models/template.model';

@Component({
  selector: 'app-sensing-templates',
  templateUrl: './sensing-templates.component.html',
  styleUrls: ['./sensing-templates.component.scss']
})
export class SensingTemplatesComponent implements OnInit {

  @Input() minSdi12: number;
  @Input() maxSdi12: number;
  @Input() sdi12Read: number;
  @Input() min1Wire: number;
  @Input() max1Wire: number;
  @Input() availableTemplates: Template[];
  motestackTemplates: Template[];

  selectedTemplateId: string;

  constructor() { }

  ngOnInit() {
  }

  getAvailableTemplates() {
    return this.availableTemplates;
  }

  addTemplate(templateId) {
    this.motestackTemplates.push(this.availableTemplates.find(i=>i.id==this.selectedTemplateId));
  }

  removeTemplate(index) {
    this.motestackTemplates.splice(index,1);
  }

}
