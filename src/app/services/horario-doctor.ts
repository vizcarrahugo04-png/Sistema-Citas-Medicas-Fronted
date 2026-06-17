import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioDoctor } from '../models/horario-doctor';

@Injectable({
  providedIn: 'root'
})
export class HorarioDoctorService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/horarios';

  findAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  save(horario: any): Observable<any> {
    return this.http.post<any>(this.url, horario);
  }

  update(id: number, horario: HorarioDoctor): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, horario);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}