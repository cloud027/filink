import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCodingComponent } from './batch-coding.component';

describe('BatchCodingComponent', () => {
  let component: BatchCodingComponent;
  let fixture: ComponentFixture<BatchCodingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchCodingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
