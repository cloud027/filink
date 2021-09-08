import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityLogTableComponent } from './facility-log-table.component';

describe('FacilityLogTableComponent', () => {
  let component: FacilityLogTableComponent;
  let fixture: ComponentFixture<FacilityLogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityLogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
