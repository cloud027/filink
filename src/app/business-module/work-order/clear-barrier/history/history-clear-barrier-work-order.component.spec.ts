import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryClearBarrierWorkOrderComponent } from './history-clear-barrier-work-order.component';

describe('HistoryClearBarrierWorkOrderComponent', () => {
  let component: HistoryClearBarrierWorkOrderComponent;
  let fixture: ComponentFixture<HistoryClearBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryClearBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryClearBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
