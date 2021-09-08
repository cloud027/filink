import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDeviceComponent } from './tab-device.component';

describe('TabDeviceComponent', () => {
  let component: TabDeviceComponent;
  let fixture: ComponentFixture<TabDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
