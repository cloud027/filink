import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmObjectComponent } from './alarm-object.component';

describe('AlarmObjectComponent', () => {
  let component: AlarmObjectComponent;
  let fixture: ComponentFixture<AlarmObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
