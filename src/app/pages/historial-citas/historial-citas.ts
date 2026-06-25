import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

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

  idHistorial: number = 0;
  fechaCambio: string = '';
  estadoAnterior: string = '';
  estadoNuevo: string = '';
  observacion: string = '';
  idCita: number = 0;

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
      error: (error) => {
        console.log('Error al listar historiales:', error);
      }
    });
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

  guardar(): void {
    if (this.idHistorial === 0) {

      const historial = {
        fechaCambio: this.fechaCambio,
        estadoAnterior: this.estadoAnterior,
        estadoNuevo: this.estadoNuevo,
        observacion: this.observacion,
        idCita: this.idCita
      };

      this.historialService.save(historial).subscribe(() => {
        alert('Historial registrado');
        this.limpiar();
        this.listarHistoriales();
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

      this.historialService.update(this.idHistorial, historial).subscribe(() => {
        alert('Historial actualizado');
        this.limpiar();
        this.listarHistoriales();
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
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar historial?')) {
      this.historialService.delete(id).subscribe(() => {
        this.listarHistoriales();
      });
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