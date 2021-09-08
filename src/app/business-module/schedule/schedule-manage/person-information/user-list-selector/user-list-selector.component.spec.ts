import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListSelectorComponent } from './user-list-selector.component';

describe('UserListSelectorComponent', () => {
  let component: UserListSelectorComponent;
  let fixture: ComponentFixture<UserListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
