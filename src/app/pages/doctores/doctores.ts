import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { DoctorService } from "../../services/doctor";
import { UsuarioService } from "../../services/usuario";
import { EspecialidadService } from "../../services/especialidad";
import { AuthService } from "../../services/auth.service";

import { Doctor } from "../../models/doctor";
import { Usuario } from "../../models/usuario";
import { Especialidad } from "../../models/especialidad";

@Component({
  selector: 'app-doctores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctores.html',
  styleUrl: './doctores.css'
})
export class Doctores implements OnInit {

  private doctorService = inject(DoctorService);
  private usuarioService = inject(UsuarioService);
  private especialidadService = inject(EspecialidadService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  doctores: Doctor[] = [];
  usuarios: Usuario[] = [];
  especialidades: Especialidad[] = [];

  idDoctor: number = 0;
  nombres: string = '';
  apellidos: string = '';
  cmp: string = '';
  telefono: string = '';
  correoProfesional: string = '';
  estado: boolean = true;
  idUsuario: number = 0;
  idEspecialidad: number = 0;
  filtro: string = '';

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarEspecialidades();
    this.listarDoctores();
  }

  listarDoctores(): void {
    this.doctorService.findAll().subscribe({
      next: (data) => {
        this.doctores = data._embedded?.doctorDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar doctores:', error);
      }
    });
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

  listarEspecialidades(): void {
    this.especialidadService.findAll().subscribe({
      next: (data) => {
        this.especialidades = data._embedded?.especialidadDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar especialidades:', error);
      }
    });
  }

  guardar(): void {
    if (this.idDoctor === 0) {
      const doctor = {
        nombres: this.nombres,
        apellidos: this.apellidos,
        cmp: this.cmp,
        telefono: this.telefono,
        correoProfesional: this.correoProfesional,
        estado: this.estado,
        idUsuario: this.idUsuario,
        idEspecialidad: this.idEspecialidad
      };

      this.doctorService.save(doctor).subscribe(() => {
        alert('Doctor registrado correctamente');
        this.limpiar();
        this.listarDoctores();
      });

    } else {
      const doctor: Doctor = {
        idDoctor: this.idDoctor,
        nombres: this.nombres,
        apellidos: this.apellidos,
        cmp: this.cmp,
        telefono: this.telefono,
        correoProfesional: this.correoProfesional,
        estado: this.estado,
        idUsuario: this.idUsuario,
        idEspecialidad: this.idEspecialidad
      };

      this.doctorService.update(this.idDoctor, doctor).subscribe(() => {
        alert('Doctor actualizado correctamente');
        this.limpiar();
        this.listarDoctores();
      });
    }
  }

  editar(doctor: Doctor): void {
    this.idDoctor = doctor.idDoctor;
    this.nombres = doctor.nombres;
    this.apellidos = doctor.apellidos;
    this.cmp = doctor.cmp;
    this.telefono = doctor.telefono;
    this.correoProfesional = doctor.correoProfesional;
    this.estado = doctor.estado;
    this.idUsuario = doctor.idUsuario;
    this.idEspecialidad = doctor.idEspecialidad;

    this.cdr.detectChanges();

    setTimeout(() => {
      document.querySelector('.app-content')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    }, 100);
  }

  eliminar(id: number): void {
    if (confirm('¿Estas seguro que deseas eliminar este doctor?')) {
      this.doctorService.delete(id).subscribe(() => {
        alert('Doctor eliminado correctamente');
        this.listarDoctores();
      });
    }
  }
  doctoresFiltrados(): Doctor[] {
  return this.doctores.filter(doctor =>
    doctor.nombres.toLowerCase().includes(this.filtro.toLowerCase()) ||
    doctor.apellidos.toLowerCase().includes(this.filtro.toLowerCase()) ||
    doctor.correoProfesional.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  limpiar(): void {
    this.idDoctor = 0;
    this.nombres = '';
    this.apellidos = '';
    this.cmp = '';
    this.telefono = '';
    this.correoProfesional = '';
    this.estado = true;
    this.idUsuario = 0;
    this.idEspecialidad = 0;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}