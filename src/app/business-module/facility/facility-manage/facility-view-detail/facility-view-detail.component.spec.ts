import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityViewDetailComponent } from './facility-view-detail.component';

describe('FacilityViewDetailComponent', () => {
  let component: FacilityViewDetailComponent;
  let fixture: ComponentFixture<FacilityViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
