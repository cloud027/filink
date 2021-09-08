import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentOperatingComponent } from './equipment-operating.component';

describe('EquipmentOperatingComponent', () => {
  let component: EquipmentOperatingComponent;
  let fixture: ComponentFixture<EquipmentOperatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentOperatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentOperatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
