import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFacilityPictureComponent } from './view-facility-picture.component';

describe('ViewFacilityPictureComponent', () => {
  let component: ViewFacilityPictureComponent;
  let fixture: ComponentFixture<ViewFacilityPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFacilityPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFacilityPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
