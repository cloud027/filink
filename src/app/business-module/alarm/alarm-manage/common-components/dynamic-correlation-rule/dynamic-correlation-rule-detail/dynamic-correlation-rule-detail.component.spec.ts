import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCorrelationRuleDetailComponent } from './dynamic-correlation-rule-detail.component';

describe('DynamicCorrelationRuleDetailComponent', () => {
  let component: DynamicCorrelationRuleDetailComponent;
  let fixture: ComponentFixture<DynamicCorrelationRuleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicCorrelationRuleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCorrelationRuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
