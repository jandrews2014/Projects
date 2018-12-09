import { Injectable } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CustomRoute } from '../models/route.model';

import { IntelligentRiverService } from './intelligent-river.service';

@Injectable()
export class RouteService {
  currentRoute: string;
  currentResource: string;
  currentParams: {};
  currentPath: string[];
  observableRoute: BehaviorSubject<CustomRoute>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private irService: IntelligentRiverService) {
    console.log('Route Service init');

    const initRoute: string = this.router.url;
    const initPath: string[] = initRoute.split('/');
    initPath.splice(0, 1);
    const initResource: string = initPath[0];
    const initParams: {} = this.route.snapshot.params;

    this.observableRoute = new BehaviorSubject<CustomRoute>({
      currentRoute: initRoute,
      currentResource: initResource,
      currentParams: initParams,
      currentPath: initPath
    });

    this.route.params.subscribe((data) => {
      console.log('!!!!!!!!!!!!!!!!!!!!', data);
    });

    this.router.events.subscribe((data: any) => {
      this.currentRoute = this.router.url;
      this.currentPath = this.currentRoute.split('/');
      this.currentPath.splice(0, 1);
      this.currentResource = this.currentPath[0];
      this.currentParams = this.route.snapshot.params;
      console.log('router, router events', this.currentRoute, this.currentPath, this.currentResource, this.currentParams);

      this.observableRoute.next({
        currentRoute: this.currentRoute,
        currentResource: this.currentResource,
        currentParams: this.currentParams,
        currentPath: this.currentPath
      });

      if ('projectId' in this.currentParams) {
        console.log('projectId', this.currentParams);
        // this.irService.setCurrentProject(this.currentParams['projectId']);
      }
    });
  }

  setCurrentParams(params: {}): void {
    this.currentParams = params;
  }
}
