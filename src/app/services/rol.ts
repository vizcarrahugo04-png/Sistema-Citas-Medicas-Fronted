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

}