import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceStatisticalComponent } from './device-statistical.component';

describe('DeviceStatisticalComponent', () => {
  let component: DeviceStatisticalComponent;
  let fixture: ComponentFixture<DeviceStatisticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceStatisticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
