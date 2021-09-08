import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmIncrementComponent } from './alarm-increment.component';

describe('AlarmIncrementComponent', () => {
  let component: AlarmIncrementComponent;
  let fixture: ComponentFixture<AlarmIncrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmIncrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
