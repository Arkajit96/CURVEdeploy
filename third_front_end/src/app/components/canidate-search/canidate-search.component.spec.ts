import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanidateSearchComponent } from './canidate-search.component';

describe('CanidateSearchComponent', () => {
  let component: CanidateSearchComponent;
  let fixture: ComponentFixture<CanidateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanidateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanidateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
