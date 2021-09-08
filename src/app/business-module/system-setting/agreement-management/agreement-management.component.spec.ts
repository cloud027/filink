import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementManagementComponent } from './agreement-management.component';

describe('AgreementManagementComponent', () => {
  let component: AgreementManagementComponent;
  let fixture: ComponentFixture<AgreementManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
