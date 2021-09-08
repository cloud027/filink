import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOrderPanelComponent } from './log-order-panel.component';

describe('LogOrderPanelComponent', () => {
  let component: LogOrderPanelComponent;
  let fixture: ComponentFixture<LogOrderPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOrderPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOrderPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
