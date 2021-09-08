import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticEchartsComponent } from './statistic-echarts.component';

describe('StatisticEchartsComponent', () => {
  let component: StatisticEchartsComponent;
  let fixture: ComponentFixture<StatisticEchartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticEchartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticEchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
