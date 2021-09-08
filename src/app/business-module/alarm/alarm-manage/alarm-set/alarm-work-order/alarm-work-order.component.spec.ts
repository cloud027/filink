import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmWorkOrderComponent } from './alarm-work-order.component';

describe('AlarmWorkOrderComponent', () => {
  let component: AlarmWorkOrderComponent;
  let fixture: ComponentFixture<AlarmWorkOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmWorkOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
