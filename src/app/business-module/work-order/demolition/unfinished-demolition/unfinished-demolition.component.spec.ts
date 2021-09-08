import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedDemolitionComponent } from './unfinished-demolition.component';

describe('UnfinishedDemolitionComponent', () => {
  let component: UnfinishedDemolitionComponent;
  let fixture: ComponentFixture<UnfinishedDemolitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedDemolitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedDemolitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
