import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyTimedataComponent } from './energy-timedata.component';

describe('EnergyTimedataComponent', () => {
  let component: EnergyTimedataComponent;
  let fixture: ComponentFixture<EnergyTimedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyTimedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyTimedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
