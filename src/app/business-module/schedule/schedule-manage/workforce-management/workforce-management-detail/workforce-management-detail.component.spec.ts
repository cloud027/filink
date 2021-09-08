import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkforceManagementDetailComponent } from './workforce-management-detail.component';

describe('WorkforceManagementDetailComponent', () => {
  let component: WorkforceManagementDetailComponent;
  let fixture: ComponentFixture<WorkforceManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkforceManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkforceManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
