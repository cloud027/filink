import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCorrelationRuleComponent } from './dynamic-correlation-rule.component';

describe('DynamicCorrelationRuleComponent', () => {
  let component: DynamicCorrelationRuleComponent;
  let fixture: ComponentFixture<DynamicCorrelationRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicCorrelationRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCorrelationRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
