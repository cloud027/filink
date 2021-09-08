import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticalCableComponent } from './optical-cable.component';

describe('OpticalCableComponent', () => {
  let component: OpticalCableComponent;
  let fixture: ComponentFixture<OpticalCableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpticalCableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticalCableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
