import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCollectEquipmentComponent } from './multiple-collect-equipment.component';

describe('MultipleCollectEquipmentComponent', () => {
  let component: MultipleCollectEquipmentComponent;
  let fixture: ComponentFixture<MultipleCollectEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleCollectEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleCollectEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
