import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAlarmComponent } from './facility-alarm.component';

describe('FacilityAlarmComponent', () => {
  let component: FacilityAlarmComponent;
  let fixture: ComponentFixture<FacilityAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
