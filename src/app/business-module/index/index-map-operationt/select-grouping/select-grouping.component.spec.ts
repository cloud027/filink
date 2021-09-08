import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroupingComponent } from './select-grouping.component';

describe('SelectGroupingComponent', () => {
  let component: SelectGroupingComponent;
  let fixture: ComponentFixture<SelectGroupingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGroupingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
