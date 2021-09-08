import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryClearBarrierWorkOrderTableComponent } from './history-clear-barrier-work-order-table.component';

describe('HistoryClearBarrierWorkOrderTableComponent', () => {
  let component: HistoryClearBarrierWorkOrderTableComponent;
  let fixture: ComponentFixture<HistoryClearBarrierWorkOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryClearBarrierWorkOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryClearBarrierWorkOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
