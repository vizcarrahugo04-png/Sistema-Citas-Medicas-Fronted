import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  horarios: HorarioDoctor[] = [];
  doctores: Doctor[] = [];

  idHorario: number = 0;
  dia: string = '';
  horaInicio: string = '';
  horaFin: string = '';
  cuposDisponibles: number = 1;
  estado: boolean = true;
  idDoctor: number = 0;

  ngOnInit(): void {
    this.listarHorarios();
    this.listarDoctores();
  }

  listarHorarios(): void {
  this.horarioService.findAll().subscribe(data => {
    console.log("HORARIOS:", data);
    this.horarios = data._embedded?.horarioDoctorDTOList || [];
    console.log("horarios cargados:", this.horarios);
  });
}

  listarDoctores(): void {
    this.doctorService.findAll().subscribe(data => {
      this.doctores = data._embedded.doctorDTOList;
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

      this.horarioService.save(horario).subscribe(() => {
        alert('Horario registrado correctamente');
        this.limpiar();
        this.listarHorarios();
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

      this.horarioService.update(this.idHorario, horario).subscribe(() => {
        alert('Horario actualizado correctamente');
        this.limpiar();
        this.listarHorarios();
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
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este horario?')) {
      this.horarioService.delete(id).subscribe(() => {
        alert('Horario eliminado correctamente');
        this.listarHorarios();
      });
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