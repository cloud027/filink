import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedClearBarrierWorkOrderComponent } from './unfinished-clear-barrier-work-order.component';

describe('UnfinishedClearBarrierWorkOrderComponent', () => {
  let component: UnfinishedClearBarrierWorkOrderComponent;
  let fixture: ComponentFixture<UnfinishedClearBarrierWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedClearBarrierWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedClearBarrierWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
