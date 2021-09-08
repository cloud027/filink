import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmConfirmComponent } from './alarm-confirm.component';

describe('AlarmConfirmComponent', () => {
  let component: AlarmConfirmComponent;
  let fixture: ComponentFixture<AlarmConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
