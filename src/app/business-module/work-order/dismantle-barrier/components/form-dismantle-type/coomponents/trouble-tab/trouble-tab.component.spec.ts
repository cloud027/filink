import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleTabComponent } from './trouble-tab.component';

describe('TroubleTabComponent', () => {
  let component: TroubleTabComponent;
  let fixture: ComponentFixture<TroubleTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
