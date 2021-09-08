import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalSliderComponent } from './statistical-slider.component';

describe('StatisticalSliderComponent', () => {
  let component: StatisticalSliderComponent;
  let fixture: ComponentFixture<StatisticalSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticalSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticalSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
