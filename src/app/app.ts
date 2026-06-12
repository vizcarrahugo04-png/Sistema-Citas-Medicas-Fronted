import { Component } from "@angular/core";
import { Roles } from "./pages/roles/roles";

@Component({
  selector: 'app-root',
  imports: [Roles],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
