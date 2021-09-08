import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAlarmAddComponent } from './current-alarm-add.component';

describe('CurrentAlarmAddComponent', () => {
  let component: CurrentAlarmAddComponent;
  let fixture: ComponentFixture<CurrentAlarmAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAlarmAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAlarmAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
