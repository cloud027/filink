import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAreaorComponent } from './tab-areaor.component';

describe('TabAreaorComponent', () => {
  let component: TabAreaorComponent;
  let fixture: ComponentFixture<TabAreaorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAreaorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabAreaorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
