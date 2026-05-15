import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leer } from './leer';

describe('Leer', () => {
  let component: Leer;
  let fixture: ComponentFixture<Leer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
