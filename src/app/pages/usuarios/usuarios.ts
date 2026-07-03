import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

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

  idUsuario = 0;
  username = '';
  correo = '';
  password = '';
  estado = true;
  idRol = 0;
  filtro = '';

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
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  listarRoles(): void {
    this.rolService.findAll().subscribe({
      next: (data) => {
        this.roles = data._embedded?.rolDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
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

      this.usuarioService.save(usuario).subscribe({
        next: () => {
          Swal.fire('¡Correcto!', 'Usuario registrado correctamente', 'success');
          this.limpiar();
          this.listarUsuarios();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
        }
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

      this.usuarioService.update(this.idUsuario, usuario).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Usuario actualizado correctamente', 'success');
          this.limpiar();
          this.listarUsuarios();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
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

    this.cdr.detectChanges();

    setTimeout(() => {
      document.getElementById('topUsuarios')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Usuario eliminado correctamente', 'success');
            this.listarUsuarios();
          },
          error: () => {
            Swal.fire(
              'No se puede eliminar',
              'Este usuario está relacionado con un doctor o paciente.',
              'error'
            );
          }
        });
      }
    });
  }

  usuariosFiltrados(): Usuario[] {
    return this.usuarios.filter(usuario =>
      usuario.username.toLowerCase().includes(this.filtro.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(this.filtro.toLowerCase())
    );
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