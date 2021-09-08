import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyNodesComponent } from './energy-nodes.component';

describe('EnergyNodesComponent', () => {
  let component: EnergyNodesComponent;
  let fixture: ComponentFixture<EnergyNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
