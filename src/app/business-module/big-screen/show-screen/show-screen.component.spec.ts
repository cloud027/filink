import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowScreenComponent } from './show-screen.component';

describe('DownloadComponent', () => {
  let component: ShowScreenComponent;
  let fixture: ComponentFixture<ShowScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowScreenComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
