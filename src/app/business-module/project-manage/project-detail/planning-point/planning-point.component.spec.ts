import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningPointComponent } from './planning-point.component';

describe('PlanningPointComponent', () => {
  let component: PlanningPointComponent;
  let fixture: ComponentFixture<PlanningPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
