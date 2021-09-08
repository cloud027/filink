import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmNameComponent } from './alarm-name.component';

describe('AlarmNameComponent', () => {
  let component: AlarmNameComponent;
  let fixture: ComponentFixture<AlarmNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
