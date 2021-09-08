import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedInspectionWorkOrderComponent } from './finished-inspection-work-order.component';

describe('FinishedInspectionWorkOrderComponent', () => {
  let component: FinishedInspectionWorkOrderComponent;
  let fixture: ComponentFixture<FinishedInspectionWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedInspectionWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedInspectionWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
