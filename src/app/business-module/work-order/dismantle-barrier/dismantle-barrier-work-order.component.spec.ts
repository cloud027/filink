import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleBarrierWorkOrderComponent } from './dismantle-barrier-work-order.component';

describe('DismantleBarrierWorkOrderComponent', () => {
  let component: DismantleBarrierWorkOrderComponent;
  let fixture: ComponentFixture<DismantleBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
