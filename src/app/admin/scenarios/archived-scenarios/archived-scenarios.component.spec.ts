import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedScenariosComponent } from './archived-scenarios.component';

describe('ArchivedScenariosComponent', () => {
  let component: ArchivedScenariosComponent;
  let fixture: ComponentFixture<ArchivedScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedScenariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
