import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageSynopsisComponent } from './storage-synopsis.component';

describe('StorageSynopsisComponent', () => {
  let component: StorageSynopsisComponent;
  let fixture: ComponentFixture<StorageSynopsisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageSynopsisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageSynopsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
