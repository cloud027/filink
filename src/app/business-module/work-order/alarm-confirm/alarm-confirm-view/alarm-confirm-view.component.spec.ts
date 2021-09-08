import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmConfirmViewComponent } from './alarm-confirm-view.component';

describe('AlarmConfirmViewComponent', () => {
  let component: AlarmConfirmViewComponent;
  let fixture: ComponentFixture<AlarmConfirmViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmConfirmViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmConfirmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
