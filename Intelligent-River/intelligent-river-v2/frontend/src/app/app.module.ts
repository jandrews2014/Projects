import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';         // ActivatedRoute
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';        // HttpHeaders, HttpRequest, HttpResponse, HttpParams
import { FormsModule } from '@angular/forms';

// ng-gui map
import { NguiMapModule} from '@ngui/map';
import { SortablejsModule } from 'angular-sortablejs';

import { AuthService } from './services/auth.service';
import { IntelligentRiverService } from './services/intelligent-river.service';
import { OnlyLoggedGuardService } from './services/only-logged-guard.service';


import { AppComponent } from './app.component';
import { RouterHelperComponent } from './components/all/router-helper/router-helper.component';
import { NavbarComponent } from './components/all/navbar/navbar.component';
import { FooterComponent } from './components/all/footer/footer.component';
import { ProjectMapComponent } from './components/all/project-map/project-map.component';
import { LoginComponent } from './components/all/login/login.component';
import { DeploymentsMapComponent } from './components/all/deployments-map/deployments-map.component';
import { LoadingScreenComponent } from './components/all/loading-screen/loading-screen.component';
import { MaintenanceComponent } from './components/routes/maintenance/maintenance.component';
import { DataComponent } from './components/routes/data/data.component';
import { DataCurrentComponent } from './components/routes/data/data-current/data-current.component';
import { DataHistoricalComponent } from './components/routes/data/data-historical/data-historical.component';
import { DeploymentsComponent } from './components/routes/deployments/deployments.component';
import { DiagnosticsComponent } from './components/routes/diagnostics/diagnostics.component';
import { DeploymentListComponent } from './components/routes/deployment-manager/deployments/deployment-list/deployment-list.component';
import { DeploymentFormComponent } from './components/routes/deployment-manager/deployments/deployment-form/deployment-form.component';
import { DeploymentManagerComponent } from './components/routes/deployment-manager/deployment-manager.component';
import { RadioListComponent } from './components/routes/deployment-manager/radios/radio-list/radio-list.component';
import { RadioFormComponent } from './components/routes/deployment-manager/radios/radio-form/radio-form.component';
import { StatusComponent } from './components/routes/status/status/status.component';
import { StatusBlockComponent } from './components/routes/status/status-block/status-block.component';
import { MotestackListComponent } from './components/routes/deployment-manager/motestacks/motestack-list/motestack-list.component';
import { MotestackFormComponent } from './components/routes/deployment-manager/motestacks/motestack-form/motestack-form.component';
import { RadioOptionsComponent } from './components/routes/deployment-manager/motestacks/motestack-form/radio-options/radio-options.component';
import { SensingTemplatesComponent } from './components/routes/deployment-manager/motestacks/motestack-form/sensing-templates/sensing-templates.component';
import { DeviceListComponent } from './components/routes/deployment-manager/devices/device-list/device-list.component';
import { DeviceFormComponent } from './components/routes/deployment-manager/devices/device-form/device-form.component';
import { TemplateListComponent } from './components/routes/deployment-manager/templates/template-list/template-list.component';
import { TemplateFormComponent } from './components/routes/deployment-manager/templates/template-form/template-form.component';

// const routes: Routes = [
//   {path: '', component: ProjectMapComponent, data: {title: 'Intelligent River'}},
//   {path: 'data', component: ProjectMapComponent, data: {title: 'Intelligent River Data'}},
//   {path: 'data/:projectId', component: ProjectMapComponent, data: {title: 'Intelligent River Data by ProjectId'}},
//   {path: 'deployments', component: DeploymentsComponent, data: {title: 'Intelligent River Deployments'}},
//   {path: 'deployments/:projectId', component: DeploymentsComponent, data: {title: 'Intelligent River Deployments'}},
// ];

const routes: Routes = [
  {path: '', component: RouterHelperComponent, data: {title: 'Intelligent River'}},
   {path: 'deployment-manager', component: DeploymentManagerComponent, canActivate: [OnlyLoggedGuardService], children: [
    {path: '', redirectTo: '/deployment-manager/deployments', pathMatch: 'full' },
    {path: 'devices', component: DeviceListComponent},
    {path: 'devices/:id', component: DeviceFormComponent},
    {path: 'templates', component: TemplateListComponent},
    {path: 'templates/:id', component: TemplateFormComponent},
    {path: 'radios', component: RadioListComponent },
    {path: 'radios/:id', component: RadioFormComponent },
    {path: 'motestacks', component: MotestackListComponent},
    {path: 'motestacks/:id', component: MotestackFormComponent},
    {path: 'deployments', component: DeploymentListComponent },
    {path: 'deployments/:id', component: DeploymentFormComponent },
  ]},
  {path: ':resource', component: RouterHelperComponent, data: {title: 'Intelligent River Data'}},
  {path: ':resource/:projectId', component: RouterHelperComponent, data: {title: 'Intelligent River Data by ProjectId'}},
  {path: ':resource/:projectId/:deploymentId', component: RouterHelperComponent, data: {title: 'Intelligent River Deployments'}}
];

@NgModule({
  declarations: [
    AppComponent,
    RouterHelperComponent,
    NavbarComponent,
    FooterComponent,
    ProjectMapComponent,
    LoginComponent,
    DeploymentsMapComponent,
    LoadingScreenComponent,
    MaintenanceComponent,
    DataComponent,
    DataCurrentComponent,
    DataHistoricalComponent,
    DeploymentsComponent,
    DiagnosticsComponent,
    DeploymentListComponent,
    DeploymentFormComponent,
    DeploymentManagerComponent,
    RadioListComponent,
    RadioFormComponent,
    StatusComponent,
    MotestackListComponent,
    MotestackFormComponent,
    RadioOptionsComponent,
    SensingTemplatesComponent,
    DeviceListComponent,
    DeviceFormComponent,
    TemplateListComponent,
    TemplateFormComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    SortablejsModule.forRoot({ animation: 150 }),
    HttpClientModule,
    FormsModule,
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBH3lG3-zHJdTTOzx-J8ft2v1syC9MGCnE'
    })
  ],
  providers: [
    AuthService,
    IntelligentRiverService,
    OnlyLoggedGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
