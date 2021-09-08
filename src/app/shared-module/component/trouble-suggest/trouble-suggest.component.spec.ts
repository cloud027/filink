import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleSuggestComponent } from './trouble-suggest.component';

describe('TroubleSuggestComponent', () => {
  let component: TroubleSuggestComponent;
  let fixture: ComponentFixture<TroubleSuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleSuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
