import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorPointComponent } from './monitor-point.component';

describe('MonitorPointComponent', () => {
  let component: MonitorPointComponent;
  let fixture: ComponentFixture<MonitorPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
