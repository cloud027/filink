import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAgreementComponent } from './config-agreement.component';

describe('ConfigAgreementComponent', () => {
  let component: ConfigAgreementComponent;
  let fixture: ComponentFixture<ConfigAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
