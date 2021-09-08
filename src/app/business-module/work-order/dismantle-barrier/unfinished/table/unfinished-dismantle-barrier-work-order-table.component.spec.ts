import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedDismantleBarrierWorkOrderTableComponent } from './unfinished-dismantle-barrier-work-order-table.component';

describe('UnfinishedDismantleBarrierWorkOrderTableComponent', () => {
  let component: UnfinishedDismantleBarrierWorkOrderTableComponent;
  let fixture: ComponentFixture<UnfinishedDismantleBarrierWorkOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedDismantleBarrierWorkOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedDismantleBarrierWorkOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
