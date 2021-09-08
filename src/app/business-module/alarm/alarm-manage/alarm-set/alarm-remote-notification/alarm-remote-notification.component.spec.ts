import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmRemoteNotificationComponent } from './alarm-remote-notification.component';

describe('AlarmRemoteNotificationComponent', () => {
  let component: AlarmRemoteNotificationComponent;
  let fixture: ComponentFixture<AlarmRemoteNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmRemoteNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmRemoteNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
