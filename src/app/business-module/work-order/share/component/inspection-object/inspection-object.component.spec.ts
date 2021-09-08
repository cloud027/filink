import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionObjectComponent } from './inspection-object.component';

describe('InspectionObjectComponent', () => {
  let component: InspectionObjectComponent;
  let fixture: ComponentFixture<InspectionObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
