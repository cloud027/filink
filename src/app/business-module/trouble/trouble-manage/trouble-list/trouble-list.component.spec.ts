import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleListComponent } from './trouble-list.component';

describe('TroubleListComponent', () => {
  let component: TroubleListComponent;
  let fixture: ComponentFixture<TroubleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
