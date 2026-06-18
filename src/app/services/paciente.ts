import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paciente } from "../models/paciente";


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/pacientes';

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

  save(paciente: any): Observable<any> {
    return this.http.post<any>(
      this.url,
      paciente,
      this.getHeaders()
    );
  }

  update(id: number, paciente: Paciente): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id}`,
      paciente,
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