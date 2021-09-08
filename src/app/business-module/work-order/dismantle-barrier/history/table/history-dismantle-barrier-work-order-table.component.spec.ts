import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDismantleBarrierWorkOrderTableComponent } from './history-dismantle-barrier-work-order-table.component';

describe('HistoryDismantleBarrierWorkOrderTableComponent', () => {
  let component: HistoryDismantleBarrierWorkOrderTableComponent;
  let fixture: ComponentFixture<HistoryDismantleBarrierWorkOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDismantleBarrierWorkOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDismantleBarrierWorkOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
