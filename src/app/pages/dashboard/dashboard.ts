import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UsuarioService } from '../../services/usuario';
import { DoctorService } from '../../services/doctor';
import { PacienteService } from '../../services/paciente';
import { CitaMedicaService } from '../../services/cita-medica';
import { ConsultorioService } from '../../services/consultorio';
import { HorarioDoctorService } from '../../services/horario-doctor';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private usuarioService = inject(UsuarioService);
  private doctorService = inject(DoctorService);
  private pacienteService = inject(PacienteService);
  private citaService = inject(CitaMedicaService);
  private consultorioService = inject(ConsultorioService);
  private horarioService = inject(HorarioDoctorService);
  private cdr = inject(ChangeDetectorRef);

  correo = localStorage.getItem('correo');
  rol = localStorage.getItem('rol');

  totalUsuarios = 0;
  totalDoctores = 0;
  totalPacientes = 0;
  totalCitas = 0;
  totalConsultorios = 0;
  totalHorarios = 0;

  ngOnInit(): void {
    this.cargarTotales();
  }

  cargarTotales(): void {
    if (this.rol === 'Administrador') {
      this.cargarUsuarios();
      this.cargarDoctores();
      this.cargarPacientes();
      this.cargarCitas();
      this.cargarConsultorios();
      this.cargarHorarios();
    }

    if (this.rol === 'Doctor') {
      this.cargarPacientes();
      this.cargarCitas();
    }

    if (this.rol === 'Paciente') {
      this.cargarCitas();
    }
  }

  cargarUsuarios(): void {
    this.usuarioService.findAll().subscribe({
      next: data => {
        this.totalUsuarios = data._embedded?.usuarioDTOList?.length || 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  cargarDoctores(): void {
    this.doctorService.findAll().subscribe({
      next: data => {
        this.totalDoctores = data._embedded?.doctorDTOList?.length || 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  cargarPacientes(): void {
    this.pacienteService.findAll().subscribe({
      next: data => {
        this.totalPacientes = data._embedded?.pacienteDTOList?.length || 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  cargarCitas(): void {
    this.citaService.findAll().subscribe({
      next: data => {
        this.totalCitas = data._embedded?.citaMedicaDTOList?.length || 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  cargarConsultorios(): void {
    this.consultorioService.findAll().subscribe({
      next: data => {
        this.totalConsultorios = data._embedded?.consultorioDTOList?.length || 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  cargarHorarios(): void {
    this.horarioService.findAll().subscribe({
      next: data => {
        this.totalHorarios = data._embedded?.horarioDoctorDTOList?.length || 0;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }
}