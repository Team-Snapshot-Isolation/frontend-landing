import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N8n } from './n8n';

describe('N8n', () => {
  let component: N8n;
  let fixture: ComponentFixture<N8n>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N8n],
    }).compileComponents();

    fixture = TestBed.createComponent(N8n);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
