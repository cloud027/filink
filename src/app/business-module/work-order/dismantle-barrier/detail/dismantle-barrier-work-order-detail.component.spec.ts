import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleBarrierWorkOrderDetailComponent } from './dismantle-barrier-work-order-detail.component';

describe('DismantleBarrierWorkOrderDetailComponent', () => {
  let component: DismantleBarrierWorkOrderDetailComponent;
  let fixture: ComponentFixture<DismantleBarrierWorkOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleBarrierWorkOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleBarrierWorkOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
