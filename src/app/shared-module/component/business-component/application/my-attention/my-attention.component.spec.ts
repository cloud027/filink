import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAttentionComponent } from './my-attention.component';

describe('MyAttentionComponent', () => {
  let component: MyAttentionComponent;
  let fixture: ComponentFixture<MyAttentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAttentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
