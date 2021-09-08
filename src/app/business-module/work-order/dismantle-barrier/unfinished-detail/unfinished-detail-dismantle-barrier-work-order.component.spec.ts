import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedDetailDismantleBarrierWorkOrderComponent } from './unfinished-detail-dismantle-barrier-work-order.component';

describe('UnfinishedDetailClearBarrierWorkOrderComponent', () => {
  let component: UnfinishedDetailDismantleBarrierWorkOrderComponent;
  let fixture: ComponentFixture<UnfinishedDetailDismantleBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedDetailDismantleBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedDetailDismantleBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
