import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlarmSetComponent } from './add-alarm-set.component';

describe('AddAlarmSetComponent', () => {
  let component: AddAlarmSetComponent;
  let fixture: ComponentFixture<AddAlarmSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAlarmSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlarmSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
