import { Component } from "@angular/core";
import { Pacientes } from "./pages/pacientes/pacientes";

@Component({
  selector: 'app-root',
  imports: [Pacientes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
