import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterHelperComponent } from './router-helper.component';

describe('RouterHelperComponent', () => {
  let component: RouterHelperComponent;
  let fixture: ComponentFixture<RouterHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
