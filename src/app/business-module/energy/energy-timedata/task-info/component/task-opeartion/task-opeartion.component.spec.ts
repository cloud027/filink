import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOpeartionComponent } from './task-opeartion.component';

describe('TaskOpeartionComponent', () => {
  let component: TaskOpeartionComponent;
  let fixture: ComponentFixture<TaskOpeartionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskOpeartionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskOpeartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
