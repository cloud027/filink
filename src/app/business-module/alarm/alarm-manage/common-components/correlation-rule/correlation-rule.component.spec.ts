import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationRuleComponent } from './correlation-rule.component';

describe('CorrelationRuleComponent', () => {
  let component: CorrelationRuleComponent;
  let fixture: ComponentFixture<CorrelationRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelationRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
