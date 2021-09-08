import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryProcessRecordTableComponent } from './history-process-record-table.component';

describe('HistoryProcessRecordTableComponent', () => {
  let component: HistoryProcessRecordTableComponent;
  let fixture: ComponentFixture<HistoryProcessRecordTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryProcessRecordTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryProcessRecordTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
