import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetailComponent } from './inspection-template-detail.component';

describe('InspectionTemplateDetailComponent', () => {
  let component: TemplateDetailComponent;
  let fixture: ComponentFixture<TemplateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
