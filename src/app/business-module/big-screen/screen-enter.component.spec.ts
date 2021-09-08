import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScreenEnterComponent} from './screen-enter.component';

describe('DownloadComponent', () => {
  let component: ScreenEnterComponent;
  let fixture: ComponentFixture<ScreenEnterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenEnterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenEnterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
