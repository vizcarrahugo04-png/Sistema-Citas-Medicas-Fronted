import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

import { HistorialCitaService } from "../../services/historial-cita";
import { CitaMedicaService } from "../../services/cita-medica";

import { HistorialCita } from "../../models/historial-cita";
import { CitaMedica } from "../../models/cita-medica";

@Component({
  selector: 'app-historial-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-citas.html',
  styleUrl: './historial-citas.css'
})
export class HistorialCitas implements OnInit {

  private historialService = inject(HistorialCitaService);
  private citaService = inject(CitaMedicaService);
  private cdr = inject(ChangeDetectorRef);

  rol = localStorage.getItem('rol');

  historiales: HistorialCita[] = [];
  citas: CitaMedica[] = [];

  idHistorial = 0;
  fechaCambio = '';
  estadoAnterior = '';
  estadoNuevo = '';
  observacion = '';
  idCita = 0;
  filtro = '';
  paginaActual = 1;
  registrosPorPagina = 5;

  ngOnInit(): void {
    this.listarHistoriales();

    if (this.rol !== 'Paciente') {
      this.listarCitas();
    }
  }

  listarHistoriales(): void {
    const request = this.rol === 'Paciente'
      ? this.historialService.findMiHistorial()
      : this.historialService.findAll();

    request.subscribe({
      next: (data) => {
        this.historiales = data._embedded?.historialCitaDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los historiales.', 'error');
      }
    });
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

  guardar(): void {
    const historial = {
      fechaCambio: this.fechaCambio,
      estadoAnterior: this.estadoAnterior,
      estadoNuevo: this.estadoNuevo,
      observacion: this.observacion,
      idCita: this.idCita
    };

    if (this.idHistorial === 0) {
      this.historialService.save(historial).subscribe({
        next: () => {
          Swal.fire('¡Correcto!', 'Historial registrado correctamente.', 'success');
          this.limpiar();
          this.listarHistoriales();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el historial.', 'error');
        }
      });

    } else {
      const historialUpdate: HistorialCita = {
        idHistorial: this.idHistorial,
        ...historial
      };

      this.historialService.update(this.idHistorial, historialUpdate).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Historial actualizado correctamente.', 'success');
          this.limpiar();
          this.listarHistoriales();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el historial.', 'error');
        }
      });
    }
  }

  editar(historial: HistorialCita): void {
    this.idHistorial = historial.idHistorial;
    this.fechaCambio = historial.fechaCambio;
    this.estadoAnterior = historial.estadoAnterior;
    this.estadoNuevo = historial.estadoNuevo;
    this.observacion = historial.observacion;
    this.idCita = historial.idCita;

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
      title: '¿Eliminar historial?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.historialService.delete(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Historial eliminado correctamente.', 'success');
            this.listarHistoriales();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el historial.', 'error');
          }
        });
      }
    });
  }

  historialesFiltrados(): HistorialCita[] {
    const texto = this.filtro.toLowerCase();

    return this.historiales.filter(historial =>
      historial.estadoAnterior.toLowerCase().includes(texto) ||
      historial.estadoNuevo.toLowerCase().includes(texto) ||
      historial.observacion.toLowerCase().includes(texto)
    );
  }

  historialesPaginados(): HistorialCita[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    return this.historialesFiltrados().slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.historialesFiltrados().length / this.registrosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  limpiar(): void {
    this.idHistorial = 0;
    this.fechaCambio = '';
    this.estadoAnterior = '';
    this.estadoNuevo = '';
    this.observacion = '';
    this.idCita = 0;
  }
}