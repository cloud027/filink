import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityDetailPanelComponent } from './facility-detail-panel.component';

describe('FacilityDetailPanelComponent', () => {
  let component: FacilityDetailPanelComponent;
  let fixture: ComponentFixture<FacilityDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
