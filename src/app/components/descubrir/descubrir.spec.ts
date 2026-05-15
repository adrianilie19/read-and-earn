import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescubrirComponent } from './descubrir';

describe('Descubrir', () => {
  let component: DescubrirComponent;
  let fixture: ComponentFixture<DescubrirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescubrirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescubrirComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
