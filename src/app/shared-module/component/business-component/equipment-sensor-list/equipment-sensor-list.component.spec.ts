import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentSensorListComponent } from './equipment-sensor-list.component';

describe('EquipmentSensorListComponent', () => {
  let component: EquipmentSensorListComponent;
  let fixture: ComponentFixture<EquipmentSensorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentSensorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentSensorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
