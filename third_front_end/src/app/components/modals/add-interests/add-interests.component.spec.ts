import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterestsComponent } from './add-interests.component';

describe('AddInterestsComponent', () => {
  let component: AddInterestsComponent;
  let fixture: ComponentFixture<AddInterestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
