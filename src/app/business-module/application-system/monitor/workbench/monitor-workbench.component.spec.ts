import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorWorkbenchComponent } from './monitor-workbench.component';

describe('MonitorWorkbenchComponent', () => {
  let component: MonitorWorkbenchComponent;
  let fixture: ComponentFixture<MonitorWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
