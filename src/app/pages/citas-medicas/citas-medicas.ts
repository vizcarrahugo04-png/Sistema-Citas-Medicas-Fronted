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

  rol = localStorage.getItem('rol');

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
  paginaActual = 1;
  registrosPorPagina = 5;

  ngOnInit(): void {
    this.listarCitas();

    if (this.rol !== 'Paciente') {
      this.listarPacientes();
    }

    this.listarDoctores();
    this.listarHorarios();
    this.listarConsultorios();
  }

  listarCitas(): void {
  let request;

  if (this.rol === 'Paciente') {
    request = this.citaService.findMisCitas();
  } else if (this.rol === 'Doctor') {
    request = this.citaService.findMisCitasDoctor();
  } else {
    request = this.citaService.findAll();
  }

  request.subscribe({
    next: (data: any) => {
      this.citas = data._embedded?.citaMedicaDTOList || [];

      if (this.rol === 'Paciente' && this.citas.length > 0) {
        this.idPaciente = this.citas[0].idPaciente;
      }

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
    if (this.rol === 'Paciente' && this.idPaciente === 0) {
      Swal.fire(
        'Falta configurar',
        'Para que el paciente cree citas automáticamente falta obtener su idPaciente desde el backend.',
        'warning'
      );
      return;
    }

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

    if (this.idCita === 0) {
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
      const citaUpdate: CitaMedica = {
        idCita: this.idCita,
        ...cita
      };

      this.citaService.update(this.idCita, citaUpdate).subscribe({
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
            Swal.fire('No se puede eliminar', 'Esta cita está relacionada con un historial.', 'error');
          }
        });
      }
    });
  }

  citasFiltradas(): CitaMedica[] {
    const texto = this.filtro.toLowerCase();

    return this.citas.filter(cita =>
      cita.fecha.toLowerCase().includes(texto) ||
      cita.motivo.toLowerCase().includes(texto) ||
      cita.estado.toLowerCase().includes(texto)
    );
  }

  citasPaginadas(): CitaMedica[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    return this.citasFiltradas().slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.citasFiltradas().length / this.registrosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  limpiar(): void {
    this.idCita = 0;
    this.fecha = '';
    this.hora = '';
    this.motivo = '';
    this.estado = 'PENDIENTE';

    if (this.rol !== 'Paciente') {
      this.idPaciente = 0;
    }

    this.idDoctor = 0;
    this.idHorario = 0;
    this.idConsultorio = 0;
  }
}