import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionWorkOrderDetailComponent } from './inspection-work-order-detail.component';

describe('InspectionWorkOrderDetailComponent', () => {
  let component: InspectionWorkOrderDetailComponent;
  let fixture: ComponentFixture<InspectionWorkOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionWorkOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionWorkOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
