import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Menu } from './pages/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private router = inject(Router);

  haySesion(): boolean {
    return localStorage.getItem('token') !== null;
  }

  esLogin(): boolean {
    return this.router.url === '/';
  }
}