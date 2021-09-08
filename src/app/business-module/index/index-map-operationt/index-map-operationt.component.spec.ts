import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMapOperationtComponent } from './index-map-operation.component';

describe('IndexMapOperationtComponent', () => {
  let component: IndexMapOperationtComponent;
  let fixture: ComponentFixture<IndexMapOperationtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexMapOperationtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexMapOperationtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
