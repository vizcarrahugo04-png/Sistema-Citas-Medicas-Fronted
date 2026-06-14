import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rol } from "../models/rol";

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private http = inject(HttpClient);
  private url = 'http://localhost:9090/roles';

  findAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  save(rol: Rol): Observable<any> {
  return this.http.post<any>(this.url, rol);
}
  
  update(id:number,rol:Rol): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`,rol);
  }

  delete(id: number): Observable<any> {
  return this.http.delete<any>(`${this.url}/${id}`);
}

}