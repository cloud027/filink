import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTaskComponent } from './data-task.component';

describe('DataTaskComponent', () => {
  let component: DataTaskComponent;
  let fixture: ComponentFixture<DataTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
