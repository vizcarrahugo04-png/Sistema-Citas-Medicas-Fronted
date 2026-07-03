import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

import { PacienteService } from "../../services/paciente";
import { UsuarioService } from "../../services/usuario";
import { AuthService } from "../../services/auth.service";

import { Paciente } from "../../models/paciente";
import { Usuario } from "../../models/usuario";

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class Pacientes implements OnInit {

  private pacienteService = inject(PacienteService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  pacientes: Paciente[] = [];
  usuarios: Usuario[] = [];

  idPaciente = 0;
  nombres = '';
  apellidos = '';
  dni = '';
  telefono = '';
  direccion = '';
  fechaNacimiento = '';
  sexo = '';
  estado = true;
  idUsuario = 0;
  filtro = '';

  ngOnInit(): void {
    this.listarPacientes();
    this.listarUsuarios();
  }

  listarPacientes(): void {
    this.pacienteService.findAll().subscribe({
      next: (data) => {
        this.pacientes = data._embedded?.pacienteDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
      }
    });
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

  guardar(): void {
    if (this.idPaciente === 0) {
      const paciente = {
        nombres: this.nombres,
        apellidos: this.apellidos,
        dni: this.dni,
        telefono: this.telefono,
        direccion: this.direccion,
        fechaNacimiento: this.fechaNacimiento,
        sexo: this.sexo,
        estado: this.estado,
        idUsuario: this.idUsuario
      };

      this.pacienteService.save(paciente).subscribe({
        next: () => {
          Swal.fire('¡Correcto!', 'Paciente registrado correctamente', 'success');
          this.limpiar();
          this.listarPacientes();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el paciente', 'error');
        }
      });

    } else {
      const paciente: Paciente = {
        idPaciente: this.idPaciente,
        nombres: this.nombres,
        apellidos: this.apellidos,
        dni: this.dni,
        telefono: this.telefono,
        direccion: this.direccion,
        fechaNacimiento: this.fechaNacimiento,
        sexo: this.sexo,
        estado: this.estado,
        idUsuario: this.idUsuario
      };

      this.pacienteService.update(this.idPaciente, paciente).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Paciente actualizado correctamente', 'success');
          this.limpiar();
          this.listarPacientes();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el paciente', 'error');
        }
      });
    }
  }

  editar(paciente: Paciente): void {
    this.idPaciente = paciente.idPaciente;
    this.nombres = paciente.nombres;
    this.apellidos = paciente.apellidos;
    this.dni = paciente.dni;
    this.telefono = paciente.telefono;
    this.direccion = paciente.direccion;
    this.fechaNacimiento = paciente.fechaNacimiento;
    this.sexo = paciente.sexo;
    this.estado = paciente.estado;
    this.idUsuario = paciente.idUsuario;

    this.cdr.detectChanges();

    setTimeout(() => {
      document.querySelector('.app-content')?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar paciente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.delete(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Paciente eliminado correctamente', 'success');
            this.listarPacientes();
          },
          error: () => {
            Swal.fire(
              'No se puede eliminar',
              'Este paciente tiene citas asociadas.',
              'error'
            );
          }
        });
      }
    });
  }

  pacientesFiltrados(): Paciente[] {
    return this.pacientes.filter(paciente =>
      paciente.nombres.toLowerCase().includes(this.filtro.toLowerCase()) ||
      paciente.apellidos.toLowerCase().includes(this.filtro.toLowerCase()) ||
      paciente.dni.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  limpiar(): void {
    this.idPaciente = 0;
    this.nombres = '';
    this.apellidos = '';
    this.dni = '';
    this.telefono = '';
    this.direccion = '';
    this.fechaNacimiento = '';
    this.sexo = '';
    this.estado = true;
    this.idUsuario = 0;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}