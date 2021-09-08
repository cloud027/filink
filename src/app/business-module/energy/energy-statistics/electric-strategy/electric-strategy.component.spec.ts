import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricStrategyComponent } from './electric-strategy.component';

describe('ElectricStrategyComponent', () => {
  let component: ElectricStrategyComponent;
  let fixture: ComponentFixture<ElectricStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
