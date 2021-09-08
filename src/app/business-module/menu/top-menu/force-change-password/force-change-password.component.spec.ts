import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceChangePasswordComponent } from './force-change-password.component';

describe('ForceChangePasswordComponent', () => {
  let component: ForceChangePasswordComponent;
  let fixture: ComponentFixture<ForceChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
