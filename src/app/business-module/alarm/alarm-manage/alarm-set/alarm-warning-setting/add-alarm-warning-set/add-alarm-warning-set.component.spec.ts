import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlarmWarningSetComponent } from './add-alarm-warning-set.component';

describe('AddAlarmWarningSetComponent', () => {
  let component: AddAlarmWarningSetComponent;
  let fixture: ComponentFixture<AddAlarmWarningSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAlarmWarningSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlarmWarningSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
