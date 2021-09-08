import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPointDetailComponent } from './plan-point-detail.component';

describe('CreateWisdomDataComponent', () => {
  let component: PlanPointDetailComponent;
  let fixture: ComponentFixture<PlanPointDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPointDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPointDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
