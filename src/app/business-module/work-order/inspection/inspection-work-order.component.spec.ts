import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionWorkOrderComponent } from './inspection-work-order.component';

describe('InspectionWorkOrderComponent', () => {
  let component: InspectionWorkOrderComponent;
  let fixture: ComponentFixture<InspectionWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
