import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeViewMenuComponent } from './three-view-menu.component';

describe('ThreeViewMenuComponent', () => {
  let component: ThreeViewMenuComponent;
  let fixture: ComponentFixture<ThreeViewMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeViewMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeViewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
