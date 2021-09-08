import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseVerificationComponent } from './license-verification.component';

describe('LicenseVerificationComponent', () => {
  let component: LicenseVerificationComponent;
  let fixture: ComponentFixture<LicenseVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
