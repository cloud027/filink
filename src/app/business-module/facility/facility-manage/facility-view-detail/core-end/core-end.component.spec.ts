import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreEndComponent } from './core-end.component';

describe('CoreEndComponent', () => {
  let component: CoreEndComponent;
  let fixture: ComponentFixture<CoreEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
