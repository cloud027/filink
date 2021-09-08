import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelectorInspectionComponent } from './map-selector-inspection.component';

describe('MapSelectorInspectionComponent', () => {
  let component: MapSelectorInspectionComponent;
  let fixture: ComponentFixture<MapSelectorInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSelectorInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectorInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
