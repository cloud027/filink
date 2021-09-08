import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedDetailInspectionWorkOrderComponent } from './unfinished-detail-inspection-work-order.component';

describe('UnfinishedDetailInspectionWorkOrderComponent', () => {
  let component: UnfinishedDetailInspectionWorkOrderComponent;
  let fixture: ComponentFixture<UnfinishedDetailInspectionWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedDetailInspectionWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedDetailInspectionWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
