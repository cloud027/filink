import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEquipmentListComponent } from './facility-equipment-list.component';

describe('FacilityEquipmentListComponent', () => {
  let component: FacilityEquipmentListComponent;
  let fixture: ComponentFixture<FacilityEquipmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityEquipmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityEquipmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
