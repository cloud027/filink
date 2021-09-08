import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleAssignComponent } from './trouble-assign.component';

describe('TroubleAssignComponent', () => {
  let component: TroubleAssignComponent;
  let fixture: ComponentFixture<TroubleAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
