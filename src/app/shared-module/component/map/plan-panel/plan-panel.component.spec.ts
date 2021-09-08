import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPanelComponent } from './plan-panel.component';

describe('PlanPanelComponent', () => {
  let component: PlanPanelComponent;
  let fixture: ComponentFixture<PlanPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
