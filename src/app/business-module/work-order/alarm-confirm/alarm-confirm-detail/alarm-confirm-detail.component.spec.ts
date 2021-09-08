import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmConfirmDetailComponent } from './alarm-confirm-detail.component';

describe('FinishedAlarmConfirmDetailComponent', () => {
  let component: AlarmConfirmDetailComponent;
  let fixture: ComponentFixture<AlarmConfirmDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmConfirmDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmConfirmDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
