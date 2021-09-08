import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesStatisticComponent } from './nodes-statistic.component';

describe('NodesStatisticComponent', () => {
  let component: NodesStatisticComponent;
  let fixture: ComponentFixture<NodesStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
