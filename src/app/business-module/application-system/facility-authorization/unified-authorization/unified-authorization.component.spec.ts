import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedAuthorizationComponent } from './unified-authorization.component';

describe('UnifiedAuthorizationComponent', () => {
  let component: UnifiedAuthorizationComponent;
  let fixture: ComponentFixture<UnifiedAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnifiedAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnifiedAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
