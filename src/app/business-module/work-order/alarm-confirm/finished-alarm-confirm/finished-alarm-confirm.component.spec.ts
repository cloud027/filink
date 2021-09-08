import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedAlarmConfirmComponent } from './finished-alarm-confirm.component';

describe('FinishedAlarmConfirmComponent', () => {
  let component: FinishedAlarmConfirmComponent;
  let fixture: ComponentFixture<FinishedAlarmConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedAlarmConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedAlarmConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
