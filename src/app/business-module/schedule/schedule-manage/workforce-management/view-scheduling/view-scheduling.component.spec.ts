import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSchedulingComponent } from './view-scheduling.component';

describe('ViewSchedulingComponent', () => {
  let component: ViewSchedulingComponent;
  let fixture: ComponentFixture<ViewSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
