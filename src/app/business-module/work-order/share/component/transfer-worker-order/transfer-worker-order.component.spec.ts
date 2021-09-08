import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferWorkerOrderComponent } from './transfer-worker-order.component';

describe('TransferWorkerOrderComponent', () => {
  let component: TransferWorkerOrderComponent;
  let fixture: ComponentFixture<TransferWorkerOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferWorkerOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferWorkerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
