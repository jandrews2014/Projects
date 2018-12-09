import { Component, OnInit } from '@angular/core';
import { Radio, RadioOption } from '../../.././../../models/radios.model';
import { IntelligentRiverService } from '../../../../../services/intelligent-river.service';
import {ActivatedRoute} from '@angular/router';
import { User } from '../../../../..//models/user.model';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-radio-form',
  templateUrl: './radio-form.component.html',
  styleUrls: ['./radio-form.component.scss']
})
export class RadioFormComponent implements OnInit {
  radioId: string;
  radio: Radio;
 private currentUser: User;

  constructor(private irService: IntelligentRiverService, private route:ActivatedRoute,private authService: AuthService) { 
    this.radio = {};
    this.radio.options = [];
  }

  ngOnInit() {
     this.radioId = this.route.snapshot.params['id'];
     if(this.radioId != 'new') {
         this.irService.getRadios().subscribe(radios => {
            this.radio = radios.find(i=> i.id == this.radioId);
          });
      }
      this.authService.observeCurrentUser.subscribe((next) => {
        this.currentUser = next;
      });
  }

  onSubmit() {
    if(this.radioId === 'new') {
      this.irService.postRadio(this.radio, this.currentUser.token).subscribe(res => {
      });
    }
    else {
      this.irService.updateRadio(this.radio, this.currentUser.token).subscribe(res => {
      })
    }
  }

  addOption() {
    this.radio.options.push({name: "",label:"",type:"text",required:false});
  }
  
  deleteOption(idx){
    this.radio.options.splice(idx, 1);
  }
}
