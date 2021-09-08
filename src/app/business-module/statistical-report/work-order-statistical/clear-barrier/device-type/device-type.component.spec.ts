import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeComponent } from './device-type.component';

describe('DeviceTypeComponent', () => {
  let component: DeviceTypeComponent;
  let fixture: ComponentFixture<DeviceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
