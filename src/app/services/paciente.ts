import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paciente } from "../models/paciente";


@Injectable({
  providedIn: 'root'
})
export class PacienteService{

  private http = inject(HttpClient);
  private url = 'http://localhost:9090/pacientes';

  findAll(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  save(Paciente: any): Observable<any>{
    return this.http.post<any>(this.url,Paciente);
  }

  update(id:number,paciente:Paciente): Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`,paciente);
  }

  delete(id:number): Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}