import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Cons, Observable } from "rxjs";
import { Consultorio } from "../models/consultorio";


@Injectable({
  providedIn: 'root'
})
export class ConsultorioService{
  private http = inject(HttpClient);
  private url = 'http://localhost:9090/consultorios';

  findAll(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  save(Consultorio: any): Observable<any>{
    return this.http.post<any>(this.url, Consultorio);
  }

  update(id: number, consultorio:Consultorio): Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`,consultorio);
  }

  delete(id:number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}