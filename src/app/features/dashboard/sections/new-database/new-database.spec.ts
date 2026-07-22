import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatabase } from './new-database';

describe('NewDatabase', () => {
  let component: NewDatabase;
  let fixture: ComponentFixture<NewDatabase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDatabase],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDatabase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
