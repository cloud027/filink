import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSelectPolymerizationComponent } from './app-select-polymerization.component';

describe('AppSelectPolymerizationComponent', () => {
  let component: AppSelectPolymerizationComponent;
  let fixture: ComponentFixture<AppSelectPolymerizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSelectPolymerizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSelectPolymerizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
