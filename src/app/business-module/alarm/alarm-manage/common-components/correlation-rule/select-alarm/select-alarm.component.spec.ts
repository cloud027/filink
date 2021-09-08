import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAlarmComponent } from './select-alarm.component';

describe('SelectAlarmComponent', () => {
  let component: SelectAlarmComponent;
  let fixture: ComponentFixture<SelectAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
