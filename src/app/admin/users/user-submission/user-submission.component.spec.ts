import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubmissionComponent } from './user-submission.component';

describe('UserSubmissionComponent', () => {
  let component: UserSubmissionComponent;
  let fixture: ComponentFixture<UserSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
