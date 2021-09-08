import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkShiftComponent } from './work-shift.component';

describe('WorkShiftComponent', () => {
  let component: WorkShiftComponent;
  let fixture: ComponentFixture<WorkShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
