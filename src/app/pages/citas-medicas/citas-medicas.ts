import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CitaMedicaService } from "../../services/cita-medica";
import { PacienteService } from "../../services/paciente";
import { DoctorService } from "../../services/doctor";
import { ConsultorioService } from "../../services/consultorio";
import { HorarioDoctorService } from "../../services/horario-doctor";

import { CitaMedica } from "../../models/cita-medica";
import { Paciente } from "../../models/paciente";
import { Doctor } from "../../models/doctor";
import { HorarioDoctor } from "../../models/horario-doctor";
import { Consultorio } from "../../models/consultorio";

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-medicas.html',
  styleUrl: './citas-medicas.css'
})
export class CitasMedicas implements OnInit {

  private citaService = inject(CitaMedicaService);
  private pacienteService = inject(PacienteService);
  private doctorService = inject(DoctorService);
  private consultorioService = inject(ConsultorioService);
  private horarioService = inject(HorarioDoctorService);
  private cdr = inject(ChangeDetectorRef);

  citas: CitaMedica[] = [];
  pacientes: Paciente[] = [];
  doctores: Doctor[] = [];
  horarios: HorarioDoctor[] = [];
  consultorios: Consultorio[] = [];

  idCita: number = 0;
  fecha: string = '';
  hora: string = '';
  motivo: string = '';
  estado: string = 'PENDIENTE';
  idPaciente: number = 0;
  idDoctor: number = 0;
  idHorario: number = 0;
  idConsultorio: number = 0;

  ngOnInit(): void {
    this.listarCitas();
    this.listarPacientes();
    this.listarDoctores();
    this.listarHorarios();
    this.listarConsultorios();
  }

  listarCitas(): void {
    this.citaService.findAll().subscribe({
      next: (data) => {
        this.citas = data._embedded?.citaMedicaDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar citas:', error);
      }
    });
  }

  listarPacientes(): void {
    this.pacienteService.findAll().subscribe({
      next: (data) => {
        this.pacientes = data._embedded?.pacienteDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar pacientes:', error);
      }
    });
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

  listarHorarios(): void {
    this.horarioService.findAll().subscribe({
      next: (data) => {
        this.horarios = data._embedded?.horarioDoctorDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar horarios:', error);
      }
    });
  }

  listarConsultorios(): void {
    this.consultorioService.findAll().subscribe({
      next: (data) => {
        this.consultorios = data._embedded?.consultorioDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar consultorios:', error);
      }
    });
  }

  guardar(): void {

    if (this.idCita === 0) {

      const cita = {
        fecha: this.fecha,
        hora: this.hora,
        motivo: this.motivo,
        estado: this.estado,
        idPaciente: this.idPaciente,
        idDoctor: this.idDoctor,
        idHorario: this.idHorario,
        idConsultorio: this.idConsultorio
      };

      this.citaService.save(cita).subscribe(() => {
        alert('Cita registrada correctamente');
        this.limpiar();
        this.listarCitas();
      });

    } else {

      const cita: CitaMedica = {
        idCita: this.idCita,
        fecha: this.fecha,
        hora: this.hora,
        motivo: this.motivo,
        estado: this.estado,
        idPaciente: this.idPaciente,
        idDoctor: this.idDoctor,
        idHorario: this.idHorario,
        idConsultorio: this.idConsultorio
      };

      this.citaService.update(this.idCita, cita).subscribe(() => {
        alert('Cita actualizada correctamente');
        this.limpiar();
        this.listarCitas();
      });
    }
  }

  editar(cita: CitaMedica): void {
    this.idCita = cita.idCita;
    this.fecha = cita.fecha;
    this.hora = cita.hora;
    this.motivo = cita.motivo;
    this.estado = cita.estado;
    this.idPaciente = cita.idPaciente;
    this.idDoctor = cita.idDoctor;
    this.idHorario = cita.idHorario;
    this.idConsultorio = cita.idConsultorio;
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta cita?')) {
      this.citaService.delete(id).subscribe(() => {
        alert('Cita eliminada correctamente');
        this.listarCitas();
      });
    }
  }

  limpiar(): void {
    this.idCita = 0;
    this.fecha = '';
    this.hora = '';
    this.motivo = '';
    this.estado = 'PENDIENTE';
    this.idPaciente = 0;
    this.idDoctor = 0;
    this.idHorario = 0;
    this.idConsultorio = 0;
  }
}