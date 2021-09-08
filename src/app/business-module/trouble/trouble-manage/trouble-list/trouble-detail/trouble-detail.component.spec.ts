import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleDetailComponent } from './trouble-detail.component';

describe('TroubleDetailComponent', () => {
  let component: TroubleDetailComponent;
  let fixture: ComponentFixture<TroubleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
