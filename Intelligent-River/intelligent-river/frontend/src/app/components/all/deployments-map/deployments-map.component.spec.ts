import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsMapComponent } from './deployments-map.component';

describe('DeploymentsMapComponent', () => {
  let component: DeploymentsMapComponent;
  let fixture: ComponentFixture<DeploymentsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
