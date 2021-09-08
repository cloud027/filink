import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertNodesComponent } from './insert-nodes.component';

describe('InsertNodesComponent', () => {
  let component: InsertNodesComponent;
  let fixture: ComponentFixture<InsertNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
