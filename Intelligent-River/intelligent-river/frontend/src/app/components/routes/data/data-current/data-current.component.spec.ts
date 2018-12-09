import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCurrentComponent } from './data-current.component';

describe('DataCurrentComponent', () => {
  let component: DataCurrentComponent;
  let fixture: ComponentFixture<DataCurrentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCurrentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
