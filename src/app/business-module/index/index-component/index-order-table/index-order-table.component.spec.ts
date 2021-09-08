import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexOrderTableComponent } from './index-order-table.component';

describe('IndexOrderTableComponent', () => {
  let component: IndexOrderTableComponent;
  let fixture: ComponentFixture<IndexOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexOrderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
