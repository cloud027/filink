import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorrelationAnalysisComponent } from './add-correlation-analysis.component';

describe('AddCorrelationAnalysisComponent', () => {
  let component: AddCorrelationAnalysisComponent;
  let fixture: ComponentFixture<AddCorrelationAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCorrelationAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorrelationAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
