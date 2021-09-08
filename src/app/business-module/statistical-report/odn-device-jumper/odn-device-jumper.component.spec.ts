import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdnDeviceJumperComponent } from './odn-device-jumper.component';

describe('OdnDeviceJumperComponent', () => {
  let component: OdnDeviceJumperComponent;
  let fixture: ComponentFixture<OdnDeviceJumperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdnDeviceJumperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdnDeviceJumperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
