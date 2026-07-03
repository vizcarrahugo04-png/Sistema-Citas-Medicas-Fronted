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

  historiales: HistorialCita[] = [];
  citas: CitaMedica[] = [];

  idHistorial = 0;
  fechaCambio = '';
  estadoAnterior = '';
  estadoNuevo = '';
  observacion = '';
  idCita = 0;
  filtro = '';

  ngOnInit(): void {
    this.listarHistoriales();
    this.listarCitas();
  }

  listarHistoriales(): void {
    this.historialService.findAll().subscribe({
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
    if (this.idHistorial === 0) {
      const historial = {
        fechaCambio: this.fechaCambio,
        estadoAnterior: this.estadoAnterior,
        estadoNuevo: this.estadoNuevo,
        observacion: this.observacion,
        idCita: this.idCita
      };

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
      const historial: HistorialCita = {
        idHistorial: this.idHistorial,
        fechaCambio: this.fechaCambio,
        estadoAnterior: this.estadoAnterior,
        estadoNuevo: this.estadoNuevo,
        observacion: this.observacion,
        idCita: this.idCita
      };

      this.historialService.update(this.idHistorial, historial).subscribe({
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
    return this.historiales.filter(historial =>
      historial.estadoAnterior.toLowerCase().includes(this.filtro.toLowerCase()) ||
      historial.estadoNuevo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      historial.observacion.toLowerCase().includes(this.filtro.toLowerCase())
    );
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