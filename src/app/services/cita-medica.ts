import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CitaMedica } from "../models/cita-medica";

@Injectable({
  providedIn:'root'
})
export class CitaMedicaService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/citas';

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

  save(cita: any): Observable<any> {
    return this.http.post<any>(
      this.url,
      cita,
      this.getHeaders()
    );
  }

  update(id: number, cita: CitaMedica): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id}`,
      cita,
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