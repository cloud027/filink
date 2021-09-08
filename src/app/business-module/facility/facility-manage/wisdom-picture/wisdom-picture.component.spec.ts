import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WisdomPictureComponent } from './wisdom-picture.component';

describe('WisdomPictureComponent', () => {
  let component: WisdomPictureComponent;
  let fixture: ComponentFixture<WisdomPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WisdomPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WisdomPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
