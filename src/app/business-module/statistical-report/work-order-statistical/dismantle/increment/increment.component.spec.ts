import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleIncrementComponent } from './increment.component';

describe('DismantleIncrementComponent', () => {
  let component: DismantleIncrementComponent;
  let fixture: ComponentFixture<DismantleIncrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleIncrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
