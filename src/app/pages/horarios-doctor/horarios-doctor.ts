import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { HorarioDoctorService } from '../../services/horario-doctor';
import { DoctorService } from '../../services/doctor';

import { HorarioDoctor } from '../../models/horario-doctor';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-horarios-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios-doctor.html',
  styleUrl: './horarios-doctor.css'
})
export class HorariosDoctor implements OnInit {

  private horarioService = inject(HorarioDoctorService);
  private doctorService = inject(DoctorService);
  private cdr = inject(ChangeDetectorRef);

  horarios: HorarioDoctor[] = [];
  doctores: Doctor[] = [];

  idHorario = 0;
  dia = '';
  horaInicio = '';
  horaFin = '';
  cuposDisponibles = 1;
  estado = true;
  idDoctor = 0;
  filtro = '';
  paginaActual = 1;
  registrosPorPagina = 5;
  rol = localStorage.getItem('rol');

  ngOnInit(): void {
    this.listarHorarios();
    this.listarDoctores();
  }

  listarHorarios(): void {

  const request =
    this.rol === 'Doctor'
      ? this.horarioService.findMisHorarios()
      : this.horarioService.findAll();

  request.subscribe({

    next: (data: any) => {

      this.horarios = data._embedded?.horarioDoctorDTOList || [];

      if (this.rol === 'Doctor' && this.horarios.length > 0) {
        this.idDoctor = this.horarios[0].idDoctor;
      }

      this.cdr.detectChanges();

    },

    error: () => {

      Swal.fire(
        'Error',
        'No se pudieron cargar los horarios.',
        'error'
      );

    }

  });

}

  listarDoctores(): void {
    this.doctorService.findAll().subscribe({
      next: (data) => {
        this.doctores = data._embedded?.doctorDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire(
          'Error',
          'No se pudieron cargar los doctores.',
          'error'
        );
      }
    });
  }

  guardar(): void {

    if (this.idHorario === 0) {

      const horario = {
        dia: this.dia,
        horaInicio: this.horaInicio,
        horaFin: this.horaFin,
        cuposDisponibles: this.cuposDisponibles,
        estado: this.estado,
        idDoctor: this.idDoctor
      };

      this.horarioService.save(horario).subscribe({

        next: () => {

          Swal.fire(
            '¡Correcto!',
            'Horario registrado correctamente.',
            'success'
          );

          this.limpiar();
          this.listarHorarios();

        },

        error: () => {

          Swal.fire(
            'Error',
            'No se pudo registrar el horario.',
            'error'
          );

        }

      });

    } else {

      const horario: HorarioDoctor = {
        idHorario: this.idHorario,
        dia: this.dia,
        horaInicio: this.horaInicio,
        horaFin: this.horaFin,
        cuposDisponibles: this.cuposDisponibles,
        estado: this.estado,
        idDoctor: this.idDoctor
      };

      this.horarioService.update(this.idHorario, horario).subscribe({

        next: () => {

          Swal.fire(
            '¡Actualizado!',
            'Horario actualizado correctamente.',
            'success'
          );

          this.limpiar();
          this.listarHorarios();

        },

        error: () => {

          Swal.fire(
            'Error',
            'No se pudo actualizar el horario.',
            'error'
          );

        }

      });

    }

  }

  editar(horario: HorarioDoctor): void {

    this.idHorario = horario.idHorario;
    this.dia = horario.dia;
    this.horaInicio = horario.horaInicio;
    this.horaFin = horario.horaFin;
    this.cuposDisponibles = horario.cuposDisponibles;
    this.estado = horario.estado;
    this.idDoctor = horario.idDoctor;

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
      title: '¿Eliminar horario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        this.horarioService.delete(id).subscribe({

          next: () => {

            Swal.fire(
              '¡Eliminado!',
              'Horario eliminado correctamente.',
              'success'
            );

            this.listarHorarios();

          },

          error: () => {

            Swal.fire(
              'No se puede eliminar',
              'Este horario está relacionado con una o más citas.',
              'error'
            );

          }

        });

      }

    });

  }

  horariosFiltrados(): HorarioDoctor[] {

    return this.horarios.filter(horario =>
      horario.dia.toLowerCase().includes(this.filtro.toLowerCase())
    );

  }

  horariosPaginados(): HorarioDoctor[] {
  const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
  const fin = inicio + this.registrosPorPagina;

  return this.horariosFiltrados().slice(inicio, fin);
}

totalPaginas(): number {
  return Math.ceil(this.horariosFiltrados().length / this.registrosPorPagina);
}

cambiarPagina(pagina: number): void {
  if (pagina >= 1 && pagina <= this.totalPaginas()) {
    this.paginaActual = pagina;
  }
}

  limpiar(): void {

    this.idHorario = 0;
    this.dia = '';
    this.horaInicio = '';
    this.horaFin = '';
    this.cuposDisponibles = 1;
    this.estado = true;
    this.idDoctor = 0;

  }

}