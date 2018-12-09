import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentManagerComponent } from './deployment-manager.component';

describe('DeploymentManagerComponent', () => {
  let component: DeploymentManagerComponent;
  let fixture: ComponentFixture<DeploymentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
