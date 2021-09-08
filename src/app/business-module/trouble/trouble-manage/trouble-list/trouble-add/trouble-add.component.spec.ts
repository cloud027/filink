import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleAddComponent } from './trouble-add.component';

describe('TroubleAddComponent', () => {
  let component: TroubleAddComponent;
  let fixture: ComponentFixture<TroubleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
