import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiesWorkOrderListComponent } from './facilities-work-order-list.component';

describe('FacilitiesWorkOrderListComponent', () => {
  let component: FacilitiesWorkOrderListComponent;
  let fixture: ComponentFixture<FacilitiesWorkOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitiesWorkOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitiesWorkOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
