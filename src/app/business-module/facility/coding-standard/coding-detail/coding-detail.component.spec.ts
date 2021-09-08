import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingDetailComponent } from './coding-detail.component';

describe('CodingDetailComponent', () => {
  let component: CodingDetailComponent;
  let fixture: ComponentFixture<CodingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
