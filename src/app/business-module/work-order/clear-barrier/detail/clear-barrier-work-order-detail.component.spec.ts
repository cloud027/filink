import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBarrierWorkOrderDetailComponent } from './clear-barrier-work-order-detail.component';

describe('ClearBarrierWorkOrderDetailComponent', () => {
  let component: ClearBarrierWorkOrderDetailComponent;
  let fixture: ComponentFixture<ClearBarrierWorkOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearBarrierWorkOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBarrierWorkOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
