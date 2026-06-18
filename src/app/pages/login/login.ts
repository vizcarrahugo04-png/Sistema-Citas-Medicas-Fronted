import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private router = inject(Router);
  private authService = inject(AuthService);

  loginData: LoginRequest = {
    correo: '',
    password: ''
  };

  mensaje = '';

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('correo', response.correo);
        localStorage.setItem('rol', response.rol);

        this.mensaje = 'Login correcto';
        console.log(response);

        if (response.rol === 'Administrador') {
        this.router.navigate(['/usuarios']);
        } else if (response.rol === 'Doctor') {
        this.router.navigate(['/doctores']);
        } else if (response.rol === 'Paciente') {
        this.router.navigate(['/pacientes']);
        }
      },
      error: () => {
        this.mensaje = 'Correo o contraseña incorrectos';
      }
    });
  }
}