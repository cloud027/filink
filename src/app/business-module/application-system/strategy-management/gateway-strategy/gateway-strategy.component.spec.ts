import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayStrategyComponent } from './gateway-strategy.component';

describe('GatewayStrategyComponent', () => {
  let component: GatewayStrategyComponent;
  let fixture: ComponentFixture<GatewayStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
