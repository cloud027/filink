import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedDetailComponent } from './unfinished-detail-clear-barrier-work-order.component';

describe('UnfinishedDetailClearBarrierWorkOrderComponent', () => {
  let component: UnfinishedDetailComponent;
  let fixture: ComponentFixture<UnfinishedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
