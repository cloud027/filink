import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlDetialComponent } from './access-control-detial.component';

describe('AccessControlDetialComponent', () => {
  let component: AccessControlDetialComponent;
  let fixture: ComponentFixture<AccessControlDetialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessControlDetialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlDetialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
