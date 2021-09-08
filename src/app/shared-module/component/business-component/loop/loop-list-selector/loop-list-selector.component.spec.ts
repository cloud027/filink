import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopListSelectorComponent } from './loop-list-selector.component';

describe('LoopListSelectorComponent', () => {
  let component: LoopListSelectorComponent;
  let fixture: ComponentFixture<LoopListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoopListSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
