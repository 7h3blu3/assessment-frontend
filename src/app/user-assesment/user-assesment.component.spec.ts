import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssesmentComponent } from './user-assesment.component';

describe('UserAssesmentComponent', () => {
  let component: UserAssesmentComponent;
  let fixture: ComponentFixture<UserAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssesmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
