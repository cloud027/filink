import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTitleComponent } from './detail-title.component';

describe('DetailTitleComponent', () => {
  let component: DetailTitleComponent;
  let fixture: ComponentFixture<DetailTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
