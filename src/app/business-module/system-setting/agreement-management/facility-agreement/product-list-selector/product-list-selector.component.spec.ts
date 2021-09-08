import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListSelectorComponent } from './product-list-selector.component';

describe('ProductListSelectorComponent', () => {
  let component: ProductListSelectorComponent;
  let fixture: ComponentFixture<ProductListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
