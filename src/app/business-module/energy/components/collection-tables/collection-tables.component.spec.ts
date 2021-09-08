import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTablesComponent } from './collection-tables.component';

describe('CollectionTablesComponent', () => {
  let component: CollectionTablesComponent;
  let fixture: ComponentFixture<CollectionTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
