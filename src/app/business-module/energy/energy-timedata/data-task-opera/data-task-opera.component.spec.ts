import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTaskOperaComponent } from './data-task-opera.component';

describe('DataTaskOperaComponent', () => {
  let component: DataTaskOperaComponent;
  let fixture: ComponentFixture<DataTaskOperaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTaskOperaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTaskOperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
