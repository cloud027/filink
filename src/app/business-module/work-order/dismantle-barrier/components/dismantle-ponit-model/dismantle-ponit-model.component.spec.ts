import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantlePonitModelComponent } from './dismantle-ponit-model.component';

describe('DismantlePonitModelComponent', () => {
  let component: DismantlePonitModelComponent;
  let fixture: ComponentFixture<DismantlePonitModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantlePonitModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantlePonitModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
