import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebUploadComponent } from './web-upload.component';

describe('WebUploadComponent', () => {
  let component: WebUploadComponent;
  let fixture: ComponentFixture<WebUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
