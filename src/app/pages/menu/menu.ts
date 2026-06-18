import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {

  private router = inject(Router);
  private authService = inject(AuthService);

  rol = localStorage.getItem('rol');
  correo = localStorage.getItem('correo');

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}