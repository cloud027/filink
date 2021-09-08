import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingStandardComponent } from './coding-standard.component';

describe('CodingStandardComponent', () => {
  let component: CodingStandardComponent;
  let fixture: ComponentFixture<CodingStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodingStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodingStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
