import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanWisdomDetailComponent } from './plan-wisdom-detail.component';

describe('PlanWisdomDetailComponent', () => {
  let component: PlanWisdomDetailComponent;
  let fixture: ComponentFixture<PlanWisdomDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanWisdomDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanWisdomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
