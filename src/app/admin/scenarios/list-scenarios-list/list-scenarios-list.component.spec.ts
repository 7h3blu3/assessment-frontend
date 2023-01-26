import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScenariosListComponent } from './list-scenarios-list.component';

describe('ListScenariosListComponent', () => {
  let component: ListScenariosListComponent;
  let fixture: ComponentFixture<ListScenariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListScenariosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListScenariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
