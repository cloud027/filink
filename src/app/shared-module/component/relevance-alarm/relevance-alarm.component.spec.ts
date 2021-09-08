import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevanceAlarmComponent } from './relevance-alarm.component';

describe('RelevanceAlarmComponent', () => {
  let component: RelevanceAlarmComponent;
  let fixture: ComponentFixture<RelevanceAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelevanceAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevanceAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
