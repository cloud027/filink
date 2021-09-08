import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAlarmPanelComponent } from './facility-alarm-panel.component';

describe('FacilityAlarmPanelComponent', () => {
  let component: FacilityAlarmPanelComponent;
  let fixture: ComponentFixture<FacilityAlarmPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityAlarmPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityAlarmPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
