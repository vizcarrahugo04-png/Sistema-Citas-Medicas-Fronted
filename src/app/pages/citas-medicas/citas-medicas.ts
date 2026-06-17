import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
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
    this.citaService.findAll().subscribe(data => {
      this.citas = data._embedded?.citaMedicaDTOList || [];
    });
  }

  listarPacientes(): void {
    this.pacienteService.findAll().subscribe(data => {
      this.pacientes = data._embedded?.pacienteDTOList || [];
    });
  }

  listarDoctores(): void {
    this.doctorService.findAll().subscribe(data => {
      this.doctores = data._embedded?.doctorDTOList || [];
    });
  }

  listarHorarios(): void {
    this.horarioService.findAll().subscribe(data => {
      console.log("HORARIOS:", data);
      this.horarios = data._embedded?.horarioDoctorDTOList || [];
      console.log("horarios cargados:", this.horarios);
    });
  }

  listarConsultorios(): void {
    this.consultorioService.findAll().subscribe(data => {
      this.consultorios = data._embedded?.consultorioDTOList || [];
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