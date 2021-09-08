import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPreviewComponent } from './audio-preview.component';

describe('SelectBroadcastProgramComponent', () => {
  let component: AudioPreviewComponent;
  let fixture: ComponentFixture<AudioPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
