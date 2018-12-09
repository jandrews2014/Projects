import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotestackListComponent } from './motestack-list.component';

describe('MotestackListComponent', () => {
  let component: MotestackListComponent;
  let fixture: ComponentFixture<MotestackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotestackListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotestackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
