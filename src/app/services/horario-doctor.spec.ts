import { TestBed } from '@angular/core/testing';

import { HorarioDoctorService } from './horario-doctor';

describe('HorarioDoctor', () => {
  let service: HorarioDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
