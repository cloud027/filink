import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmOperationComponent } from './alarm-operation.component';

describe('AlarmOperationComponent', () => {
  let component: AlarmOperationComponent;
  let fixture: ComponentFixture<AlarmOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
