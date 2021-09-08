import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorFollowComponent } from './monitor-follow.component';

describe('MonitorFollowComponent', () => {
  let component: MonitorFollowComponent;
  let fixture: ComponentFixture<MonitorFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
