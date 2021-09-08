import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingChangesComponent } from './grouping-changes.component';

describe('GroupingChangesComponent', () => {
  let component: GroupingChangesComponent;
  let fixture: ComponentFixture<GroupingChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupingChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
