import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexStatisticalChartComponent } from './index-statistical-chart.component';

describe('IndexStatisticalChartComponent', () => {
  let component: IndexStatisticalChartComponent;
  let fixture: ComponentFixture<IndexStatisticalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexStatisticalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexStatisticalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
