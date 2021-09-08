import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCableComponent } from './view-cable.component';

describe('ViewCableComponent', () => {
  let component: ViewCableComponent;
  let fixture: ComponentFixture<ViewCableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
