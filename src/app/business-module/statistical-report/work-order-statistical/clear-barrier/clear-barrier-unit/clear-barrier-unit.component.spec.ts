import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBarrierUnitComponent } from './clear-barrier-unit.component';

describe('ClearBarrierUnitComponent', () => {
  let component: ClearBarrierUnitComponent;
  let fixture: ComponentFixture<ClearBarrierUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearBarrierUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBarrierUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
