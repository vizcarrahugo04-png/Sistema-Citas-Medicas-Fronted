import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Doctor } from "../models/doctor";

@Injectable({
  providedIn:'root'
})
export class DoctorService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/doctores';

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

  save(doctor: any): Observable<any> {
    return this.http.post<any>(
      this.url,
      doctor,
      this.getHeaders()
    );
  }

  update(id: number, doctor: Doctor): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id}`,
      doctor,
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