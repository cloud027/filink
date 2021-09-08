import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPaginationComponent } from './asset-pagination.component';

describe('PaginationComponent', () => {
  let component: AssetPaginationComponent;
  let fixture: ComponentFixture<AssetPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
