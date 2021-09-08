import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstViewMenuComponent } from './first-view-menu.component';

describe('FirstViewMenuComponent', () => {
  let component: FirstViewMenuComponent;
  let fixture: ComponentFixture<FirstViewMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstViewMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstViewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
