import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorEquipmentListComponent } from './monitor-equipment-list.component';

describe('MonitorEquipmentListComponent', () => {
  let component: MonitorEquipmentListComponent;
  let fixture: ComponentFixture<MonitorEquipmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorEquipmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEquipmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
