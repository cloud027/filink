import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityParticularsCardComponent } from './facility-particulars-card.component';

describe('FacilityParticularsCardComponent', () => {
  let component: FacilityParticularsCardComponent;
  let fixture: ComponentFixture<FacilityParticularsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityParticularsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityParticularsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
