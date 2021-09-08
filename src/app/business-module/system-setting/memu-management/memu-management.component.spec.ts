import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemuManagementComponent } from './memu-management.component';

describe('MemuManagementComponent', () => {
  let component: MemuManagementComponent;
  let fixture: ComponentFixture<MemuManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemuManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemuManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
