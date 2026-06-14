import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Especialidad } from '../models/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService{
  private http = inject(HttpClient);
  private url = 'http://localhost:9090/especialidades';

  findAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  save(especialidad:any): Observable<any> {
    return this.http.post<any>(this.url,especialidad);
  }

  update(id: number, especialidad: Especialidad): Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`, especialidad);
  }

  delete(id:number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}