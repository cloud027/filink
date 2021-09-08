import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexConfigComponent } from './index-config.component';

describe('IndexConfigComponent', () => {
  let component: IndexConfigComponent;
  let fixture: ComponentFixture<IndexConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
