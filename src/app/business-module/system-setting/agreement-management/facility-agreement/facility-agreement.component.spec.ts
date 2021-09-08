import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAgreementComponent } from './facility-agreement.component';

describe('FacilityAgreementComponent', () => {
  let component: FacilityAgreementComponent;
  let fixture: ComponentFixture<FacilityAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
