import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartPoleModelTreeComponent } from './smart-pole-model-tree.component';

describe('SmartPoleModelTreeComponent', () => {
  let component: SmartPoleModelTreeComponent;
  let fixture: ComponentFixture<SmartPoleModelTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartPoleModelTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartPoleModelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
