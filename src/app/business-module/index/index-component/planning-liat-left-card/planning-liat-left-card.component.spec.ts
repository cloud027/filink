import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningLiatLeftCardComponent } from './planning-liat-left-card.component';

describe('PlanningLiatLeftCardComponent', () => {
  let component: PlanningLiatLeftCardComponent;
  let fixture: ComponentFixture<PlanningLiatLeftCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningLiatLeftCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningLiatLeftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
