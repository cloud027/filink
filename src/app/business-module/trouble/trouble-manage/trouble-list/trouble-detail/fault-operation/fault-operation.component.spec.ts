import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultOperationComponent } from './fault-operation.component';

describe('FaultOperationComponent', () => {
  let component: FaultOperationComponent;
  let fixture: ComponentFixture<FaultOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
