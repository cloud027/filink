import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicOperationComponent } from './basic-operation.component';

describe('BasicOperationComponent', () => {
  let component: BasicOperationComponent;
  let fixture: ComponentFixture<BasicOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
