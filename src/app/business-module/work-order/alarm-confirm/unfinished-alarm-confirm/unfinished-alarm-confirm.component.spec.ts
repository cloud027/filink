import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedAlarmConfirmComponent } from './unfinished-alarm-confirm.component';

describe('UnfinishedAlarmConfirmComponent', () => {
  let component: UnfinishedAlarmConfirmComponent;
  let fixture: ComponentFixture<UnfinishedAlarmConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedAlarmConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedAlarmConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
