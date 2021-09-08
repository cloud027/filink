import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanWisdomListComponent } from './plan-wisdom-list.component';

describe('PlanWisdomListComponent', () => {
  let component: PlanWisdomListComponent;
  let fixture: ComponentFixture<PlanWisdomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanWisdomListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanWisdomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
