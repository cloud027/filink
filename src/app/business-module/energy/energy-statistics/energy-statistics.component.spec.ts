import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyStatisticsComponent } from './energy-statistics.component';

describe('EnergyStatisticsComponent', () => {
  let component: EnergyStatisticsComponent;
  let fixture: ComponentFixture<EnergyStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
