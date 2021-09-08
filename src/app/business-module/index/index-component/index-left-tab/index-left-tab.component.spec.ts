import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexLeftTabComponent } from './index-left-tab.component';

describe('IndexLeftTabComponent', () => {
  let component: IndexLeftTabComponent;
  let fixture: ComponentFixture<IndexLeftTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexLeftTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexLeftTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
