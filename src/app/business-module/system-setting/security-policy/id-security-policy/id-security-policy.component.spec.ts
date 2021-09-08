import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdSecurityPolicyComponent } from './id-security-policy.component';

describe('IdSecurityPolicyComponent', () => {
  let component: IdSecurityPolicyComponent;
  let fixture: ComponentFixture<IdSecurityPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdSecurityPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdSecurityPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
