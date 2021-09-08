import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationAlarmComponent } from './correlation-alarm.component';

describe('CorrelationAlarmComponent', () => {
  let component: CorrelationAlarmComponent;
  let fixture: ComponentFixture<CorrelationAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelationAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
