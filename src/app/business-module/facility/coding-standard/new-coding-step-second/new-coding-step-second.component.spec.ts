import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCodingStepSecondComponent } from './new-coding-step-second.component';

describe('NewCodingStepSecondComponent', () => {
  let component: NewCodingStepSecondComponent;
  let fixture: ComponentFixture<NewCodingStepSecondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCodingStepSecondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCodingStepSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
