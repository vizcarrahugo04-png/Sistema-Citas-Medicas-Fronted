import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CitaMedica } from "../models/cita-medica";


@Injectable({
  providedIn:'root'
})
export class CitaMedicaService {
  private http= inject(HttpClient);
  private url= 'http://localhost:9090/citas';

  findAll(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  save(cita: any): Observable<any>{
    return this.http.post<any>(this.url, cita);
  }

  update(id:number, cita:CitaMedica): Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`,cita);
  }

  delete(id:number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}