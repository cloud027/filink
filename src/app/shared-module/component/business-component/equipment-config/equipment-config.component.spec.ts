import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentConfigComponent } from './equipment-config.component';

describe('EquipmentConfigComponent', () => {
  let component: EquipmentConfigComponent;
  let fixture: ComponentFixture<EquipmentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
