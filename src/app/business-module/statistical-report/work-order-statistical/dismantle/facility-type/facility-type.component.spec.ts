import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantleFacilityTypeComponent } from './facility-type.component';

describe('DismantleFacilityTypeComponent', () => {
  let component: DismantleFacilityTypeComponent;
  let fixture: ComponentFixture<DismantleFacilityTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DismantleFacilityTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantleFacilityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
