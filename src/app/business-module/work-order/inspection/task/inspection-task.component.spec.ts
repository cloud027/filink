import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTaskComponent } from './inspection-task.component';

describe('InspectionTaskComponent', () => {
  let component: InspectionTaskComponent;
  let fixture: ComponentFixture<InspectionTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
