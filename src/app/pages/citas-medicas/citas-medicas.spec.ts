import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasMedicas } from './citas-medicas';

describe('CitasMedicas', () => {
  let component: CitasMedicas;
  let fixture: ComponentFixture<CitasMedicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasMedicas],
    }).compileComponents();

    fixture = TestBed.createComponent(CitasMedicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
