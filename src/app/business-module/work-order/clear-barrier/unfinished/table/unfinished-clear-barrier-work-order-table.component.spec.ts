import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedClearBarrierWorkOrderTableComponent } from './unfinished-clear-barrier-work-order-table.component';

describe('UnfinishedClearBarrierWorkOrderTableComponent', () => {
  let component: UnfinishedClearBarrierWorkOrderTableComponent;
  let fixture: ComponentFixture<UnfinishedClearBarrierWorkOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedClearBarrierWorkOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedClearBarrierWorkOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
