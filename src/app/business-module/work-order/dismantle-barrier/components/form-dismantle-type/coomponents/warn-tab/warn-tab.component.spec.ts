import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnTabComponent } from './warn-tab.component';

describe('WarnTabComponent', () => {
  let component: WarnTabComponent;
  let fixture: ComponentFixture<WarnTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarnTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
