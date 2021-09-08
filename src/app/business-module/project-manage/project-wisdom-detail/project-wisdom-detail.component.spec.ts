import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWisdomDetailComponent } from './project-wisdom-detail.component';

describe('ProjectWisdomDetailComponent', () => {
  let component: ProjectWisdomDetailComponent;
  let fixture: ComponentFixture<ProjectWisdomDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWisdomDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWisdomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
