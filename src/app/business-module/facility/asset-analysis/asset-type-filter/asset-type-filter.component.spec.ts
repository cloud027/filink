import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeFilterComponent } from './asset-type-filter.component';

describe('AssetTypeFilterComponent', () => {
  let component: AssetTypeFilterComponent;
  let fixture: ComponentFixture<AssetTypeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTypeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
