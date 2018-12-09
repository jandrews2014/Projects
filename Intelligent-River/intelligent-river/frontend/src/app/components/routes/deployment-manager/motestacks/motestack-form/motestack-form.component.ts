import { Component, OnInit } from '@angular/core';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import {ActivatedRoute} from '@angular/router';
import { User } from '../../../../..//models/user.model';
import { AuthService } from '../../../../../services/auth.service';
import { MotestackForm, Motestack, MotestackPost } from '../../.././../../models/motestack.model';
import { Radio } from '../../../../../models/radios.model';
import { Template } from '../../../../../models/template.model';
import {Project } from '../../../../../models/projects.model'


@Component({
  selector: 'app-motestack-form',
  templateUrl: './motestack-form.component.html',
  styleUrls: ['./motestack-form.component.scss']
})
export class MotestackFormComponent implements OnInit {

  motestackId: string;
  motestack: Motestack;
  motestackForm: MotestackForm;
  motestackPost: MotestackPost;
  radioId: string;
  usiSufix: string;

  private currentUser: User;
  constructor(private irService: IntelligentRiverService, private route:ActivatedRoute,private authService: AuthService) { 
    this.motestackForm = {};
    this.motestackForm.projects = [];
    this.motestackForm.radios = [];
    this.motestackForm.templates = [];
    this.motestackPost = {};
  }

  ngOnInit() {
    this.irService.getMotestacksForm().subscribe(motestackForm =>{
      this.motestackForm = motestackForm;
    });
    this.motestackId = this.route.snapshot.params['id'];
    if(this.motestackId != 'new') {
        this.irService.getMotestacks().subscribe(motestacks => {
        this.motestack = motestacks.find(i=> i.id == this.motestackId);

        this.radioId = this.motestack.comm.radio.id;
        // fill post fields
        this.motestackPost.id = this.motestack.id;
        this.motestackPost.active = this.motestack.active;
        this.motestackPost.label = this.motestack.label;
        this.motestackPost.max1Wire = this.motestack.max1Wire;
        this.motestackPost.min1Wire = this.motestack.min1Wire;
        this.motestackPost.maxSdi12 = this.motestack.maxSdi12;
        this.motestackPost.minSdi12 = this.motestack.minSdi12;
        this.motestackPost.numAds = this.motestack.numAds;
        this.motestackPost.nvsramLog = this.motestack.nvsramLog;
        this.motestackPost.projectId = this.motestack.projectId;
        this.motestackPost.sPeriod = this.motestack.sPeriod;
        this.motestackPost.sTrans = this.motestack.sTrans;
        this.motestackPost.sdi12Read = this.motestack.sdi12Read;
        this.motestackPost.sdi12St = this.motestack.sdi12St;
        this.motestackPost.sdi12V3 = this.motestack.sdi12V3;
        this.motestackPost.uri = this.motestack.uri;
        this.usiSufix = this.motestack.uri.substring(this.motestack.uri.indexOf('#')+1);
        this.motestackPost.sLogSize = this.motestack.sLogSize;
        });
    }
    this.authService.observeCurrentUser.subscribe((next) => {
      this.currentUser = next;
    });
  }

  onSubmit() {
    this.motestackPost.uri = `http://www.intelligentriver.org/resource/deployment#`+this.usiSufix;
  }

}
