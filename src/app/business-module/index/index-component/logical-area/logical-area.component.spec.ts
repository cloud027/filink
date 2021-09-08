import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicalAreaComponent } from './logical-area.component';

describe('LogicalAreaComponent', () => {
  let component: LogicalAreaComponent;
  let fixture: ComponentFixture<LogicalAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicalAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicalAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
