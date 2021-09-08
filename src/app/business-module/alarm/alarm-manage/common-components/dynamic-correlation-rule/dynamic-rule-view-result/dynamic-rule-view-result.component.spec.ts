import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRuleViewResultComponent } from './dynamic-rule-view-result.component';

describe('DynamicRuleViewResultComponent', () => {
  let component: DynamicRuleViewResultComponent;
  let fixture: ComponentFixture<DynamicRuleViewResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicRuleViewResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicRuleViewResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
