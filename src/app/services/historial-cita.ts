import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HistorialCita } from "../models/historial-cita";

@Injectable({
  providedIn: 'root'
})
export class HistorialCitaService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/historial-citas';

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  findAll(): Observable<any> {
    return this.http.get<any>(this.url, this.getHeaders());
  }

  findMiHistorial(): Observable<any> {
    return this.http.get<any>(`${this.url}/mi-historial`, this.getHeaders());
  }

  save(historial: any): Observable<any> {
    return this.http.post<any>(this.url, historial, this.getHeaders());
  }

  update(id: number, historial: HistorialCita): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, historial, this.getHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, this.getHeaders());
  }
}