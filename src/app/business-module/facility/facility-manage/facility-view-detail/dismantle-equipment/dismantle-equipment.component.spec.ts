import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleEquipmentComponent } from './dismantle-equipment.component';

describe('DismantleEquipmentComponent', () => {
  let component: DismantleEquipmentComponent;
  let fixture: ComponentFixture<DismantleEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
