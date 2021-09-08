import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductModelComponent } from './select-product-model.component';

describe('SelectProductModelComponent', () => {
  let component: SelectProductModelComponent;
  let fixture: ComponentFixture<SelectProductModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProductModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProductModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
