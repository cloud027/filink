import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistEquipmentComponent } from './exist-equipment.component';

describe('ExistEquipmentComponent', () => {
  let component: ExistEquipmentComponent;
  let fixture: ComponentFixture<ExistEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
