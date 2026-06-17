import { TestBed } from '@angular/core/testing';

import { HistorialCita } from './historial-cita';

describe('HistorialCita', () => {
  let service: HistorialCita;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialCita);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
