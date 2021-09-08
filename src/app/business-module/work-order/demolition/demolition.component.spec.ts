import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemolitionComponent } from './demolition.component';

describe('DemolitionComponent', () => {
  let component: DemolitionComponent;
  let fixture: ComponentFixture<DemolitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemolitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemolitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
