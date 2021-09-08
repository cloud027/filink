import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsNodesComponent } from './details-nodes.component';

describe('DetailsNodesComponent', () => {
  let component: DetailsNodesComponent;
  let fixture: ComponentFixture<DetailsNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
