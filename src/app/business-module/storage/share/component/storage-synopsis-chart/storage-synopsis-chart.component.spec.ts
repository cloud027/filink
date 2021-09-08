import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageSynopsisChartComponent } from './storage-synopsis-chart.component';

describe('StorageSynopsisChartComponent', () => {
  let component: StorageSynopsisChartComponent;
  let fixture: ComponentFixture<StorageSynopsisChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageSynopsisChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageSynopsisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
