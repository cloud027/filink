import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishDemolitionComponent } from './finish-demolition.component';

describe('FinishDemolitionComponent', () => {
  let component: FinishDemolitionComponent;
  let fixture: ComponentFixture<FinishDemolitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishDemolitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishDemolitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
