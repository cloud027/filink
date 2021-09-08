import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PartsDetailsComponent} from './parts-detail.component';

describe('PartsDetailsComponent', () => {
  let component: PartsDetailsComponent;
  let fixture: ComponentFixture<PartsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartsDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
