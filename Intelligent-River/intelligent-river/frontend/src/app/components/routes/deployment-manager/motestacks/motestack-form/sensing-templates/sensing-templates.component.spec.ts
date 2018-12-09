import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensingTemplatesComponent } from './sensing-templates.component';

describe('SensingTemplatesComponent', () => {
  let component: SensingTemplatesComponent;
  let fixture: ComponentFixture<SensingTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensingTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensingTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
