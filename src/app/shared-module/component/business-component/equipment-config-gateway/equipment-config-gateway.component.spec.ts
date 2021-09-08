import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentConfigGatewayComponent } from './equipment-config-gateway.component';

describe('EquipmentConfigGatewayComponent', () => {
  let component: EquipmentConfigGatewayComponent;
  let fixture: ComponentFixture<EquipmentConfigGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentConfigGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentConfigGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
