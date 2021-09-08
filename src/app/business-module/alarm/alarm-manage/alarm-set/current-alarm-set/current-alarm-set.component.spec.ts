import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAlarmSetComponent } from './current-alarm-set.component';

describe('CurrentAlarmSetComponent', () => {
  let component: CurrentAlarmSetComponent;
  let fixture: ComponentFixture<CurrentAlarmSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAlarmSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAlarmSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
