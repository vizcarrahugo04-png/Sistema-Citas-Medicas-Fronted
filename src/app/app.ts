import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './pages/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  haySesion(): boolean {
    return localStorage.getItem('token') !== null;
  }
}