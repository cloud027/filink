import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleFlowComponent } from './trouble-flow.component';

describe('TroubleFlowComponent', () => {
  let component: TroubleFlowComponent;
  let fixture: ComponentFixture<TroubleFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
