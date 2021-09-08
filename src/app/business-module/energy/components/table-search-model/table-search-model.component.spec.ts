import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSearchModelComponent } from './table-search-model.component';

describe('TableSearchModelComponent', () => {
  let component: TableSearchModelComponent;
  let fixture: ComponentFixture<TableSearchModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSearchModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSearchModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
