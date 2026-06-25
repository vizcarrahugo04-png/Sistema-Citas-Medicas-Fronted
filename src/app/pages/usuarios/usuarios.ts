import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { UsuarioService } from "../../services/usuario";
import { RolService } from "../../services/rol";
import { AuthService } from "../../services/auth.service";

import { Usuario } from "../../models/usuario";
import { Rol } from "../../models/rol";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];
  roles: Rol[] = [];

  idUsuario: number = 0;
  username: string = '';
  correo: string = '';
  password: string = '';
  estado: boolean = true;
  idRol: number = 0;

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarRoles();
  }

  listarUsuarios(): void {
    this.usuarioService.findAll().subscribe({
      next: (data) => {
        this.usuarios = data._embedded?.usuarioDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar usuarios:', error);
      }
    });
  }

  listarRoles(): void {
    this.rolService.findAll().subscribe({
      next: (data) => {
        this.roles = data._embedded?.rolDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar roles:', error);
      }
    });
  }

  guardar(): void {
    if (this.idUsuario === 0) {
      const usuario = {
        username: this.username,
        correo: this.correo,
        password: this.password,
        estado: this.estado,
        idRol: this.idRol
      };

      this.usuarioService.save(usuario).subscribe(() => {
        alert('Usuario registrado correctamente');
        this.limpiar();
        this.listarUsuarios();
      });

    } else {
      const usuario: Usuario = {
        idUsuario: this.idUsuario,
        username: this.username,
        correo: this.correo,
        password: this.password,
        estado: this.estado,
        idRol: this.idRol
      };

      this.usuarioService.update(this.idUsuario, usuario).subscribe(() => {
        alert('Usuario actualizado correctamente');
        this.limpiar();
        this.listarUsuarios();
      });
    }
  }

  editar(usuario: Usuario): void {
    this.idUsuario = usuario.idUsuario;
    this.username = usuario.username;
    this.correo = usuario.correo;
    this.password = usuario.password;
    this.estado = usuario.estado;
    this.idRol = usuario.idRol;
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe(() => {
        alert('Usuario eliminado correctamente');
        this.listarUsuarios();
      });
    }
  }

  limpiar(): void {
    this.idUsuario = 0;
    this.username = '';
    this.correo = '';
    this.password = '';
    this.estado = true;
    this.idRol = 0;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}