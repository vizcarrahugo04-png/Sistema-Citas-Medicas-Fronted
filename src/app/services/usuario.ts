import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usuario } from "../models/usuario";


@Injectable({
  providedIn: 'root'
})
export class UsuarioService{
  private http= inject(HttpClient);
  private url= 'http://localhost:9090/usuarios';

  findAll(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  save(Usuario:any):Observable<any> {
    return this.http.post<any>(this.url, Usuario);
  }
  update(id:number, usuario:Usuario): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`,usuario);
  }

  delete(id:number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}