import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmWarningSettingComponent } from './alarm-warning-setting.component';

describe('AlarmWarningSettingComponent', () => {
  let component: AlarmWarningSettingComponent;
  let fixture: ComponentFixture<AlarmWarningSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmWarningSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmWarningSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
