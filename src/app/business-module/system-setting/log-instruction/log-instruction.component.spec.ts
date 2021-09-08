import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInstructionComponent } from './log-instruction.component';

describe('LogInstructionComponent', () => {
  let component: LogInstructionComponent;
  let fixture: ComponentFixture<LogInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
