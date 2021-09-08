import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityWorkOrderComponent } from './facility-work-order.component';

describe('FacilityWorkOrderComponent', () => {
  let component: FacilityWorkOrderComponent;
  let fixture: ComponentFixture<FacilityWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
