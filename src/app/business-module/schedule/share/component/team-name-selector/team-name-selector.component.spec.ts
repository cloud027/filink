import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNameSelectorComponent } from './team-name-selector.component';

describe('TeamNameSelectorComponent', () => {
  let component: TeamNameSelectorComponent;
  let fixture: ComponentFixture<TeamNameSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamNameSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
