import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmDisposeComponent } from './alarm-dispose.component';

describe('AlarmDisposeComponent', () => {
  let component: AlarmDisposeComponent;
  let fixture: ComponentFixture<AlarmDisposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmDisposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDisposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
