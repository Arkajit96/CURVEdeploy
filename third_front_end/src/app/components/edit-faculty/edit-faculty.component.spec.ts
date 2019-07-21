import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFacultyComponent } from './edit-faculty.component';

describe('EditFacultyComponent', () => {
  let component: EditFacultyComponent;
  let fixture: ComponentFixture<EditFacultyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFacultyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
