import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFailureDistributionFilterComponent } from './asset-failure-distribution-filter.component';

describe('AssetFailureDistributionFilterComponent', () => {
  let component: AssetFailureDistributionFilterComponent;
  let fixture: ComponentFixture<AssetFailureDistributionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetFailureDistributionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetFailureDistributionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
