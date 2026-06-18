import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usuario } from "../models/usuario";
import { HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class UsuarioService{
  private http= inject(HttpClient);
  private url= 'http://localhost:9090/usuarios';
  private getHeaders() {
  const token = localStorage.getItem('token');

  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  };
}

  findAll(): Observable<any>{
  return this.http.get<any>(
    this.url,
    this.getHeaders()
  );
}

  save(Usuario:any):Observable<any> {
  return this.http.post<any>(
    this.url,
    Usuario,
    this.getHeaders()
  );
}

  update(id:number, usuario:Usuario): Observable<any> {
    return this.http.put<any>(
  `${this.url}/${id}`,
  usuario,
  this.getHeaders()
);
  }

  delete(id:number): Observable<any> {
    return this.http.delete<any>(
  `${this.url}/${id}`,
  this.getHeaders()
);
  }
}