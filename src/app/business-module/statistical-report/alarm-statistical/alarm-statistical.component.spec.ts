import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmStatisticalComponent } from './alarm-statistical.component';

describe('AlarmStatisticalComponent', () => {
  let component: AlarmStatisticalComponent;
  let fixture: ComponentFixture<AlarmStatisticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmStatisticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
