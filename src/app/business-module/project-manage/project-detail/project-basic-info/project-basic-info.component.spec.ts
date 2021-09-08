import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBasicInfoComponent } from './project-basic-info.component';

describe('ProjectBasicInfoComponent', () => {
  let component: ProjectBasicInfoComponent;
  let fixture: ComponentFixture<ProjectBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
