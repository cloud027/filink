import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetGrowthRateFilterComponent } from './asset-growth-rate-filter.component';

describe('AssetGrowthRateFilterComponent', () => {
  let component: AssetGrowthRateFilterComponent;
  let fixture: ComponentFixture<AssetGrowthRateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetGrowthRateFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetGrowthRateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
