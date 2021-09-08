import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCollectionListComponent } from './my-collection-list.component';

describe('MyCollectionListComponent', () => {
  let component: MyCollectionListComponent;
  let fixture: ComponentFixture<MyCollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCollectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
