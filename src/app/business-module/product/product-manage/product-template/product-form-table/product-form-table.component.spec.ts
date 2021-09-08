import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormTableComponent } from './product-form-table.component';

describe('ProductFormTableComponent', () => {
  let component: ProductFormTableComponent;
  let fixture: ComponentFixture<ProductFormTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFormTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
