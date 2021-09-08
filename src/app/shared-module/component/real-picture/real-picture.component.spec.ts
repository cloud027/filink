import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealPictureComponent } from './real-picture.component';

describe('RealPictureComponent', () => {
  let component: RealPictureComponent;
  let fixture: ComponentFixture<RealPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
