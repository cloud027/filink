import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreEndViewComponent } from './core-end-view.component';

describe('CoreEndViewComponent', () => {
  let component: CoreEndViewComponent;
  let fixture: ComponentFixture<CoreEndViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreEndViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreEndViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
