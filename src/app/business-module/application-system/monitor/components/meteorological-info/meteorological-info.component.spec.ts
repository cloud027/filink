import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteorologicalInfoComponent } from './meteorological-info.component';

describe('MeteorologicalInfoComponent', () => {
  let component: MeteorologicalInfoComponent;
  let fixture: ComponentFixture<MeteorologicalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteorologicalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteorologicalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
