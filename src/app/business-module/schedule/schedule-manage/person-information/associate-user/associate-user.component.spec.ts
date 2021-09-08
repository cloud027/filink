import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateUserComponent } from './associate-user.component';

describe('AssociateUserComponent', () => {
  let component: AssociateUserComponent;
  let fixture: ComponentFixture<AssociateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
