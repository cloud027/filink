import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPointPanelComponent } from './plan-point-panel.component';

describe('PlanPointPanelComponent', () => {
  let component: PlanPointPanelComponent;
  let fixture: ComponentFixture<PlanPointPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPointPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPointPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
