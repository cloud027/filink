import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentWarehouseListComponent } from './equipment-warehouse-list.component';

describe('EquipmentWarehouseListComponent', () => {
  let component: EquipmentWarehouseListComponent;
  let fixture: ComponentFixture<EquipmentWarehouseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentWarehouseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentWarehouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
