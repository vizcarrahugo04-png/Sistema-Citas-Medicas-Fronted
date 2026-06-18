import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../models/login-request";
import { Observable } from "rxjs";
import { LoginResponse } from "../models/login-response";



@Injectable({
    providedIn:'root'
})
export class AuthService{
    private http = inject(HttpClient);

    private url = 'http://localhost:9090/auth';

    login(data: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse>(`${this.url}/login`, data);
    }
}