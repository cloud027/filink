import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleStatusComponent } from './status.component';

describe('dismantleStatusComponent', () => {
  let component: DismantleStatusComponent;
  let fixture: ComponentFixture<DismantleStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
