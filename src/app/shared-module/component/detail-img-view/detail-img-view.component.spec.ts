import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailImgViewComponent } from './detail-img-view.component';

describe('DetailImgViewComponent', () => {
  let component: DetailImgViewComponent;
  let fixture: ComponentFixture<DetailImgViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailImgViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
