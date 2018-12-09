import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  logoBase: string;
  logos: string[];
  urls: string[];

  constructor() {
    this.logoBase = 'assets/img/';
    this.logos = [
      this.logoBase + 'footer/fau.png',
      this.logoBase + 'footer/clemson.png',
      this.logoBase + 'footer/ice.png',
      this.logoBase + 'footer/aiken.png',
      this.logoBase + 'footer/epa.png',
      this.logoBase + 'footer/nsf.png'
    ];
    this.urls = [
      'http://www.fau.edu',
      'http://www.clemson.edu',
      'http://www.clemson.edu/public/ecology',
      'http://http://www.pepaiken.org/summer-institute.html',
      'https://www.epa.gov',
      'https://www.nsf.gov'
    ];
  }

  ngOnInit() {
  }

}
