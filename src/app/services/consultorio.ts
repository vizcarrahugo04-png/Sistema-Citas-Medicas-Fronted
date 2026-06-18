import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Consultorio } from "../models/consultorio";


@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/consultorios';

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

  save(consultorio: any): Observable<any> {
    return this.http.post<any>(
      this.url,
      consultorio,
      this.getHeaders()
    );
  }

  update(id: number, consultorio: Consultorio): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id}`,
      consultorio,
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