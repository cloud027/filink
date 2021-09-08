import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDeviceInfoComponent } from './select-device-info.component';

describe('SelectDeviceInfoComponent', () => {
  let component: SelectDeviceInfoComponent;
  let fixture: ComponentFixture<SelectDeviceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDeviceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
