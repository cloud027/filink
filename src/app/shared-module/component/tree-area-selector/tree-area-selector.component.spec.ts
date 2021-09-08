import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeAreaSelectorComponent } from './tree-area-selector.component';

describe('TreeAreaSelectorComponent', () => {
  let component: TreeAreaSelectorComponent;
  let fixture: ComponentFixture<TreeAreaSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeAreaSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeAreaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
