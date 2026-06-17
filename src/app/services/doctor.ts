import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Doctor } from "../models/doctor";


@Injectable({
  providedIn:'root'
})
export class DoctorService{
  private http = inject(HttpClient);
  private url = 'http://localhost:9090/doctores';

  findAll(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  save(Doctor: any): Observable<any>{
    return this.http.post<any>(this.url,Doctor);
  }

  update(id:number,doctor:Doctor): Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`,doctor)
  }

  delete(id:number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }
}