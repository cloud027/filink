import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexFacilityOrderListComponent } from './index-facility-order-list.component';

describe('IndexFacilityOrderListComponent', () => {
  let component: IndexFacilityOrderListComponent;
  let fixture: ComponentFixture<IndexFacilityOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexFacilityOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexFacilityOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
