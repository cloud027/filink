import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningConditionComponent } from './screening-condition.component';

describe('ScreeningConditionComponent', () => {
  let component: ScreeningConditionComponent;
  let fixture: ComponentFixture<ScreeningConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreeningConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
