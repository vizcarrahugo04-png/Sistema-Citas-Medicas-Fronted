import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RolService } from "../../services/rol";
import { Rol } from "../../models/rol";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {
  private rolService = inject(RolService);

  roles: Rol[] = [];

  ngOnInit(): void {
    this.rolService.findAll().subscribe(data => {
      console.log(data);
      this.roles = data._embedded.rolDTOList;
      console.log("roles cargados:", this.roles);
    });
  }
}