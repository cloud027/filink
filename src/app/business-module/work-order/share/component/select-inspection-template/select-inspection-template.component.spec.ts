import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInspectionTemplateComponent } from './select-inspection-template.component';

describe('SelectInspectionTemplateComponent', () => {
  let component: SelectInspectionTemplateComponent;
  let fixture: ComponentFixture<SelectInspectionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectInspectionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInspectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
