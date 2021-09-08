import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityViewDetailLogComponent } from './facility-view-detail-log.component';

describe('FacilityViewDetailLogComponent', () => {
  let component: FacilityViewDetailLogComponent;
  let fixture: ComponentFixture<FacilityViewDetailLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityViewDetailLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityViewDetailLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
