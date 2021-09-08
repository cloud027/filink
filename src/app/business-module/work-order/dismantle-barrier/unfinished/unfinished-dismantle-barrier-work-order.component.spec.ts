import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedDismantleBarrierWorkOrderComponent } from './unfinished-dismantle-barrier-work-order.component';

describe('UnfinishedDismantleBarrierWorkOrderComponent', () => {
  let component: UnfinishedDismantleBarrierWorkOrderComponent;
  let fixture: ComponentFixture<UnfinishedDismantleBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedDismantleBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedDismantleBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
