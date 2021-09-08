import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWisdomListComponent } from './project-wisdom-list.component';

describe('ProjectWisdomListComponent', () => {
  let component: ProjectWisdomListComponent;
  let fixture: ComponentFixture<ProjectWisdomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWisdomListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWisdomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
