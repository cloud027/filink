import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTaskDetailComponent } from './inspection-task-detail.component';

describe('InspectionTaskDetailComponent', () => {
  let component: InspectionTaskDetailComponent;
  let fixture: ComponentFixture<InspectionTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
