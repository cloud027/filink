import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogStatisticalComponent } from './log-statistical.component';

describe('LogStatisticalComponent', () => {
  let component: LogStatisticalComponent;
  let fixture: ComponentFixture<LogStatisticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogStatisticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
