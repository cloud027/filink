import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantlePercentComponent } from './percent.component';

describe('DismantlePercentComponent', () => {
  let component: DismantlePercentComponent;
  let fixture: ComponentFixture<DismantlePercentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantlePercentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantlePercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
