import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

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

  idCita = 0;
  fecha = '';
  hora = '';
  motivo = '';
  estado = 'PENDIENTE';
  idPaciente = 0;
  idDoctor = 0;
  idHorario = 0;
  idConsultorio = 0;
  filtro = '';

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
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las citas.', 'error');
      }
    });
  }

  listarPacientes(): void {
    this.pacienteService.findAll().subscribe({
      next: (data) => {
        this.pacientes = data._embedded?.pacienteDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los pacientes.', 'error');
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
        Swal.fire('Error', 'No se pudieron cargar los doctores.', 'error');
      }
    });
  }

  listarHorarios(): void {
    this.horarioService.findAll().subscribe({
      next: (data) => {
        this.horarios = data._embedded?.horarioDoctorDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los horarios.', 'error');
      }
    });
  }

  listarConsultorios(): void {
    this.consultorioService.findAll().subscribe({
      next: (data) => {
        this.consultorios = data._embedded?.consultorioDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los consultorios.', 'error');
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

      this.citaService.save(cita).subscribe({
        next: () => {
          Swal.fire('¡Correcto!', 'Cita registrada correctamente.', 'success');
          this.limpiar();
          this.listarCitas();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar la cita.', 'error');
        }
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

      this.citaService.update(this.idCita, cita).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Cita actualizada correctamente.', 'success');
          this.limpiar();
          this.listarCitas();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar la cita.', 'error');
        }
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
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.delete(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Cita eliminada correctamente.', 'success');
            this.listarCitas();
          },
          error: () => {
            Swal.fire(
              'No se puede eliminar',
              'Esta cita está relacionada con un historial.',
              'error'
            );
          }
        });
      }
    });
  }

  citasFiltradas(): CitaMedica[] {
    return this.citas.filter(cita =>
      cita.fecha.toLowerCase().includes(this.filtro.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      cita.estado.toLowerCase().includes(this.filtro.toLowerCase())
    );
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