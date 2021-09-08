import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricStrategyInfoComponent } from './electric-strategy-info.component';

describe('ElectricStrategyInfoComponent', () => {
  let component: ElectricStrategyInfoComponent;
  let fixture: ComponentFixture<ElectricStrategyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricStrategyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricStrategyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
