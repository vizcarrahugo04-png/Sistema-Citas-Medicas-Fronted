import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioDoctor } from '../models/horario-doctor';

@Injectable({
  providedIn: 'root'
})
export class HorarioDoctorService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/horarios';

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  findAll(): Observable<any> {
    return this.http.get<any>(
      this.url,
      this.getHeaders()
    );
  }

  findMisHorarios(): Observable<any> {
  return this.http.get<any>(
    `${this.url}/mis-horarios`,
    this.getHeaders()
  );
}

  save(horario: any): Observable<any> {
    return this.http.post<any>(
      this.url,
      horario,
      this.getHeaders()
    );
  }

  update(id: number, horario: HorarioDoctor): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id}`,
      horario,
      this.getHeaders()
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/${id}`,
      this.getHeaders()
    );
  }
}
