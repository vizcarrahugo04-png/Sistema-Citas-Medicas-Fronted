import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RolService } from "../../services/rol";
import { Rol } from "../../models/rol";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {
  private rolService = inject(RolService);

  roles: Rol[] = [];

  idRol:number = 0;
  nombre: string ="";
  descripcion: string ="";

  ngOnInit(): void {
    this.listar();
  }
  
  listar(): void {
    this.rolService.findAll().subscribe(data =>{
      this.roles = data._embedded.rolDTOList;
    });
  }

  guardar(): void {
    const rol = {
      nombre: this.nombre,
      descripcion: this.descripcion
    };

    if(this.idRol === 0) {
      this.rolService.save(rol as any).subscribe(() =>{
        alert("Rol registrado correctamente");
        this.limpiar();
        this.listar();
      });
    }else{
      this.rolService.update (this.idRol,{
        idRol: this.idRol,
        nombre:this.nombre,
        descripcion:this.descripcion
      }).subscribe(()=>{
        alert("Rol actualizado correctamente");
        this.limpiar();
        this.listar();
      })
    }
  }

  editar(rol:Rol): void {
    this.idRol = rol.idRol;
    this.nombre = rol.nombre;
    this.descripcion = rol.descripcion;
  }

  eliminar(id: number): void {
    if(confirm("¿Seguro que deseas eliminar este rol?")) {
      this.rolService.delete(id).subscribe(()=>{
        alert("Rol eliminado correctamente");
        this.listar();
      });
    }
  }

  limpiar(): void {
    this.idRol = 0;
    this.nombre ="";
    this.descripcion ="";
  }
}