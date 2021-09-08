import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoViewFilterComponent } from './photo-view-filter.component';

describe('PhotoViewFilterComponent', () => {
  let component: PhotoViewFilterComponent;
  let fixture: ComponentFixture<PhotoViewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoViewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
