import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustCoordinatesComponent } from './adjust-coordinates.component';

describe('AdjustCoordinatesComponent', () => {
  let component: AdjustCoordinatesComponent;
  let fixture: ComponentFixture<AdjustCoordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustCoordinatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
