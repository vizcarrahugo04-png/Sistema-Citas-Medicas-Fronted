import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HistorialCita } from "../models/historial-cita";


@Injectable({
  providedIn:'root'
})
export class HistorialCitaService{
  private http= inject(HttpClient);
  private url= 'http://localhost:9090/historial-citas';

  findAll():Observable<any>{
    return this.http.get<any>(this.url);
  }

  save(historial:any): Observable<any>{
    return this.http.post<any>(this.url,historial);
  }

  update(id:number,historial:any): Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`,historial);
  }

  delete(id:number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}