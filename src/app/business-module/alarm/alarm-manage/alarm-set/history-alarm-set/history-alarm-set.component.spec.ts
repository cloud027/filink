import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAlarmSetComponent } from './history-alarm-set.component';

describe('HistoryAlarmSetComponent', () => {
  let component: HistoryAlarmSetComponent;
  let fixture: ComponentFixture<HistoryAlarmSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryAlarmSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryAlarmSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
