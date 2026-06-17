import { TestBed } from '@angular/core/testing';

import { CitaMedica } from './cita-medica';

describe('CitaMedica', () => {
  let service: CitaMedica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaMedica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
