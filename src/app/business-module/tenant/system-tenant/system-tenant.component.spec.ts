import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTenantComponent } from './system-tenant.component';

describe('SystemTenantComponent', () => {
  let component: SystemTenantComponent;
  let fixture: ComponentFixture<SystemTenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
