import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderAddComponent } from './work-order-add.component';

describe('WorkOrderAddComponent', () => {
  let component: WorkOrderAddComponent;
  let fixture: ComponentFixture<WorkOrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
