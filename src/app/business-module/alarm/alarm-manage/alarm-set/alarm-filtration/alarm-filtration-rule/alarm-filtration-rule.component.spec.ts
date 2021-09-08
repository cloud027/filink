import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmFiltrationRuleComponent } from './alarm-filtration-rule.component';

describe('AlarmFiltrationRuleComponent', () => {
  let component: AlarmFiltrationRuleComponent;
  let fixture: ComponentFixture<AlarmFiltrationRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmFiltrationRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmFiltrationRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
