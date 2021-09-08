import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionHlComponent } from './collection-hl.component';

describe('CollectionHlComponent', () => {
  let component: CollectionHlComponent;
  let fixture: ComponentFixture<CollectionHlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionHlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionHlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
