import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexOperationalDataComponent } from './index-operational-data.component';

describe('IndexOperationalDataComponent', () => {
  let component: IndexOperationalDataComponent;
  let fixture: ComponentFixture<IndexOperationalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexOperationalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexOperationalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
