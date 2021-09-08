import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleImgViewComponent } from './trouble-img-view.component';

describe('TroubleImgViewComponent', () => {
  let component: TroubleImgViewComponent;
  let fixture: ComponentFixture<TroubleImgViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleImgViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
