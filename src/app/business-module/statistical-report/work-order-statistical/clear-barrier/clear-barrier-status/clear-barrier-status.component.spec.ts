import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBarrierStatusComponent } from './clear-barrier-status.component';

describe('ClearBarrierStatusComponent', () => {
  let component: ClearBarrierStatusComponent;
  let fixture: ComponentFixture<ClearBarrierStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearBarrierStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBarrierStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
