import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBarrierWorkOrderComponent } from './clear-barrier-work-order.component';

describe('ClearBarrierWorkOrderComponent', () => {
  let component: ClearBarrierWorkOrderComponent;
  let fixture: ComponentFixture<ClearBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
