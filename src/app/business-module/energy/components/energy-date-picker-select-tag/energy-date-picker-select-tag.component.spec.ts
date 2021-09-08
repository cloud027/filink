import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyDatePickerSelectTagComponent } from './energy-date-picker-select-tag.component';

describe('EnergyDatePickerSelectTagComponent', () => {
  let component: EnergyDatePickerSelectTagComponent;
  let fixture: ComponentFixture<EnergyDatePickerSelectTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyDatePickerSelectTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyDatePickerSelectTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
