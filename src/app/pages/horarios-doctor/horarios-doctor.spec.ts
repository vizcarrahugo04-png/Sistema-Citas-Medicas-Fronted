import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosDoctor } from './horarios-doctor';

describe('HorariosDoctor', () => {
  let component: HorariosDoctor;
  let fixture: ComponentFixture<HorariosDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosDoctor],
    }).compileComponents();

    fixture = TestBed.createComponent(HorariosDoctor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
