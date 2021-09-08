import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricStrategyInsertComponent } from './electric-strategy-insert.component';

describe('ElectricStrategyInsertComponent', () => {
  let component: ElectricStrategyInsertComponent;
  let fixture: ComponentFixture<ElectricStrategyInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricStrategyInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricStrategyInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
