import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleHistoryRecordComponent } from './trouble-history-record.component';

describe('TroubleHistoryRecordComponent', () => {
  let component: TroubleHistoryRecordComponent;
  let fixture: ComponentFixture<TroubleHistoryRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleHistoryRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleHistoryRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
