import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdnDeviceResourcesComponent } from './odn-device-resources.component';

describe('OdnDeviceResourcesComponent', () => {
  let component: OdnDeviceResourcesComponent;
  let fixture: ComponentFixture<OdnDeviceResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdnDeviceResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdnDeviceResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
