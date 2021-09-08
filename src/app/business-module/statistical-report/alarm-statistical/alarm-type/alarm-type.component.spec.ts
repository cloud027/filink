import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmTypeComponent } from './alarm-type.component';

describe('AlarmTypeComponent', () => {
  let component: AlarmTypeComponent;
  let fixture: ComponentFixture<AlarmTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
