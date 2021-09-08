import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBarrierRatioComponent } from './clear-barrier-ratio.component';

describe('ClearBarrierRatioComponent', () => {
  let component: ClearBarrierRatioComponent;
  let fixture: ComponentFixture<ClearBarrierRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearBarrierRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBarrierRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
