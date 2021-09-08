import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleStatisticComponent } from './trouble-statistic.component';

describe('TroubleStatisticComponent', () => {
  let component: TroubleStatisticComponent;
  let fixture: ComponentFixture<TroubleStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
