import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedInspectionWorkOrderComponent } from './unfinished-inspection-work-order.component';

describe('UnfinishedInspectionWorkOrderComponent', () => {
  let component: UnfinishedInspectionWorkOrderComponent;
  let fixture: ComponentFixture<UnfinishedInspectionWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedInspectionWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedInspectionWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
