import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDismantleBarrierWorkOrderComponent } from './history-dismantle-barrier-work-order.component';

describe('HistoryDismantleBarrierWorkOrderComponent', () => {
  let component: HistoryDismantleBarrierWorkOrderComponent;
  let fixture: ComponentFixture<HistoryDismantleBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDismantleBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDismantleBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
