import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHistoricalComponent } from './data-historical.component';

describe('DataHistoricalComponent', () => {
  let component: DataHistoricalComponent;
  let fixture: ComponentFixture<DataHistoricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataHistoricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
