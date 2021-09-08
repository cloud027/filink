import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityImgViewComponent } from './facility-img-view.component';

describe('FacilityImgViewComponent', () => {
  let component: FacilityImgViewComponent;
  let fixture: ComponentFixture<FacilityImgViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityImgViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
