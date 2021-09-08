import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaAlarmComponent } from './area-alarm.component';

describe('AreaAlarmComponent', () => {
  let component: AreaAlarmComponent;
  let fixture: ComponentFixture<AreaAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
