import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagementDetailComponent } from './team-management-detail.component';

describe('TeamManagementDetailComponent', () => {
  let component: TeamManagementDetailComponent;
  let fixture: ComponentFixture<TeamManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
