import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorEquipmentDetailsComponent } from './monitor-equipment-details.component';

describe('MonitorEquipmentDetailsComponent', () => {
  let component: MonitorEquipmentDetailsComponent;
  let fixture: ComponentFixture<MonitorEquipmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorEquipmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEquipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
