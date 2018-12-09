import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotestackFormComponent } from './motestack-form.component';

describe('MotestackFormComponent', () => {
  let component: MotestackFormComponent;
  let fixture: ComponentFixture<MotestackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotestackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotestackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
