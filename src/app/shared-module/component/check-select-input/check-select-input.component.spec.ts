import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSelectInputComponent } from './check-select-input.component';

describe('CheckSelectInputComponent', () => {
  let component: CheckSelectInputComponent;
  let fixture: ComponentFixture<CheckSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
