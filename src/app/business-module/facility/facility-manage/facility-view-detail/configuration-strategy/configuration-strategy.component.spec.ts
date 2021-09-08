import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStrategyComponent } from './configuration-strategy.component';

describe('ConfigurationStrategyComponent', () => {
  let component: ConfigurationStrategyComponent;
  let fixture: ComponentFixture<ConfigurationStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
