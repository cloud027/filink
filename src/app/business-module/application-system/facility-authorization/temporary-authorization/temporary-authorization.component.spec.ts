import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryAuthorizationComponent } from './temporary-authorization.component';

describe('TemporaryAuthorizationComponent', () => {
  let component: TemporaryAuthorizationComponent;
  let fixture: ComponentFixture<TemporaryAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporaryAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
