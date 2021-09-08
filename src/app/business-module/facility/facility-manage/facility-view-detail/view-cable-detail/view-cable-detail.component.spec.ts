import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCableDetailComponent } from './view-cable-detail.component';

describe('ViewCableDetailComponent', () => {
  let component: ViewCableDetailComponent;
  let fixture: ComponentFixture<ViewCableDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCableDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
