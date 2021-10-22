import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignScenariosComponent } from './assign-scenarios.component';

describe('AssignScenariosComponent', () => {
  let component: AssignScenariosComponent;
  let fixture: ComponentFixture<AssignScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignScenariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
