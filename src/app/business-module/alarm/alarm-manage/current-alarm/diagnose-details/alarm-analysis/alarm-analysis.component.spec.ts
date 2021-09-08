import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmAnalysisComponent } from './alarm-analysis.component';

describe('AlarmAnalysisComponent', () => {
  let component: AlarmAnalysisComponent;
  let fixture: ComponentFixture<AlarmAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
