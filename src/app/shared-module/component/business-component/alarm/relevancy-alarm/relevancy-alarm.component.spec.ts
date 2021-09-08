import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevancyAlarmComponent } from './relevancy-alarm.component';

describe('RelevancyAlarmComponent', () => {
  let component: RelevancyAlarmComponent;
  let fixture: ComponentFixture<RelevancyAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelevancyAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevancyAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
