import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rol } from "../models/rol";

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/roles';

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

  save(rol: Rol): Observable<any> {
    return this.http.post<any>(
      this.url,
      rol,
      this.getHeaders()
    );
  }

  update(id: number, rol: Rol): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${id}`,
      rol,
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