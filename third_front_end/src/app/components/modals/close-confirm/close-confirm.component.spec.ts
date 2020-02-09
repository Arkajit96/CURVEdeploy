import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseConfirmComponent } from './close-confirm.component';

describe('CloseConfirmComponent', () => {
  let component: CloseConfirmComponent;
  let fixture: ComponentFixture<CloseConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
