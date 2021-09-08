import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultExperienceComponent } from './fault-experience.component';

describe('FaultExperienceComponent', () => {
  let component: FaultExperienceComponent;
  let fixture: ComponentFixture<FaultExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
