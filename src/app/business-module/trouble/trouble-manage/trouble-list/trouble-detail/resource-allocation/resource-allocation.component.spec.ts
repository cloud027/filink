import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAllocationComponent } from './resource-allocation.component';

describe('ResourceAllocationComponent', () => {
  let component: ResourceAllocationComponent;
  let fixture: ComponentFixture<ResourceAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
