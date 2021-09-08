import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementsComponent } from './increments.component';

describe('IncrementsComponent', () => {
  let component: IncrementsComponent;
  let fixture: ComponentFixture<IncrementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
