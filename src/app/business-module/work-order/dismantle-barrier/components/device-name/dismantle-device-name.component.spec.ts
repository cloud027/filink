import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleDeviceNameComponent } from './dismantle-device-name.component';

describe('DismantleDeviceNameComponent', () => {
  let component: DismantleDeviceNameComponent;
  let fixture: ComponentFixture<DismantleDeviceNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleDeviceNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleDeviceNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
