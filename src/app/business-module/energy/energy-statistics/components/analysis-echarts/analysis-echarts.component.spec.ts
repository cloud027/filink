import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisEchartsComponent } from './analysis-echarts.component';

describe('AnalysisEchartsComponent', () => {
  let component: AnalysisEchartsComponent;
  let fixture: ComponentFixture<AnalysisEchartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisEchartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisEchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
