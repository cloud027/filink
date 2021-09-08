import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargebackWorkOrderComponent } from './chargeback-work-order.component';

describe('ChargebackWorkOrderComponent', () => {
  let component: ChargebackWorkOrderComponent;
  let fixture: ComponentFixture<ChargebackWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargebackWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargebackWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
