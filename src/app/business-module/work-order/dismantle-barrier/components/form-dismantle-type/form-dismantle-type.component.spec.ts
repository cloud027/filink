import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDismantleTypeComponent } from './form-dismantle-type.component';

describe('FormDismantleTypeComponent', () => {
  let component: FormDismantleTypeComponent;
  let fixture: ComponentFixture<FormDismantleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDismantleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDismantleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
