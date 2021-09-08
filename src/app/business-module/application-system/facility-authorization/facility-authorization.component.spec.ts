import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAuthorizationComponent } from './facility-authorization.component';

describe('FacilityAuthorizationComponent', () => {
  let component: FacilityAuthorizationComponent;
  let fixture: ComponentFixture<FacilityAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
