import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdnDeviceSelectComponent } from './odn-device-select.component';

describe('OdnDeviceSelectComponent', () => {
  let component: OdnDeviceSelectComponent;
  let fixture: ComponentFixture<OdnDeviceSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdnDeviceSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdnDeviceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
