import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceObjectComponent } from './device-object.component';

describe('DeviceObjectComponent', () => {
  let component: DeviceObjectComponent;
  let fixture: ComponentFixture<DeviceObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
