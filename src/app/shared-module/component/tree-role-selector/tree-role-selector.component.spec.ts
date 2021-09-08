import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeRoleSelectorComponent } from './tree-role-selector.component';

describe('TreeRoleSelectorComponent', () => {
  let component: TreeRoleSelectorComponent;
  let fixture: ComponentFixture<TreeRoleSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeRoleSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeRoleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
