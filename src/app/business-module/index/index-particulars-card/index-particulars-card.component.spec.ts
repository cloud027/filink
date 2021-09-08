import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexParticularsCardComponent } from './index-particulars-card.component';

describe('IndexParticularsCardComponent', () => {
  let component: IndexParticularsCardComponent;
  let fixture: ComponentFixture<IndexParticularsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexParticularsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexParticularsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
