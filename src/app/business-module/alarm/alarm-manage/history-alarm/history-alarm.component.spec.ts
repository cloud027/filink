import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAlarmComponent } from './history-alarm.component';

describe('HistoryAlarmComponent', () => {
  let component: HistoryAlarmComponent;
  let fixture: ComponentFixture<HistoryAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
