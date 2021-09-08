import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAlarmComponent } from './current-alarm.component';

describe('CurrentAlarmComponent', () => {
  let component: CurrentAlarmComponent;
  let fixture: ComponentFixture<CurrentAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
