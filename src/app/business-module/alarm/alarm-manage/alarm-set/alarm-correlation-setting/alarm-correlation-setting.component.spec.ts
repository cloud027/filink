import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {AlarmCorrelationSettingComponent} from './alarm-correlation-setting.component';

describe('AlarmCorrelationSettingComponent', () => {
  let component: AlarmCorrelationSettingComponent;
  let fixture: ComponentFixture<AlarmCorrelationSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmCorrelationSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmCorrelationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
