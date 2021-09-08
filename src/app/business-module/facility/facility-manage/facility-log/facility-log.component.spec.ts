import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityLogComponent } from './facility-log.component';

describe('FacilityLogComponent', () => {
  let component: FacilityLogComponent;
  let fixture: ComponentFixture<FacilityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
