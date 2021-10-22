import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScenariosComponent } from './list-scenarios.component';

describe('ListScenariosComponent', () => {
  let component: ListScenariosComponent;
  let fixture: ComponentFixture<ListScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListScenariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
