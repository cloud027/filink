import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopListMapComponent } from './loop-list-map.component';

describe('LoopListMapComponent', () => {
  let component: LoopListMapComponent;
  let fixture: ComponentFixture<LoopListMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoopListMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopListMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
