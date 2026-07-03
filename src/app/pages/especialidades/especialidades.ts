import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

import { EspecialidadService } from "../../services/especialidad";
import { Especialidad } from "../../models/especialidad";

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css'
})
export class Especialidades implements OnInit {

  private service = inject(EspecialidadService);
  private cdr = inject(ChangeDetectorRef);

  especialidades: Especialidad[] = [];

  idEspecialidad = 0;
  nombre = '';
  descripcion = '';
  estado = true;
  filtro = '';

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.service.findAll().subscribe({
      next: (data) => {
        this.especialidades = data._embedded?.especialidadDTOList || [];
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire(
          'Error',
          'No se pudieron cargar las especialidades.',
          'error'
        );
      }
    });
  }

  guardar(): void {

    if (this.idEspecialidad === 0) {

      const especialidad = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        estado: this.estado
      };

      this.service.save(especialidad).subscribe({

        next: () => {

          Swal.fire(
            '¡Correcto!',
            'Especialidad registrada correctamente.',
            'success'
          );

          this.limpiar();
          this.listar();

        },

        error: () => {

          Swal.fire(
            'Error',
            'No se pudo registrar la especialidad.',
            'error'
          );

        }

      });

    } else {

      const especialidad: Especialidad = {
        idEspecialidad: this.idEspecialidad,
        nombre: this.nombre,
        descripcion: this.descripcion,
        estado: this.estado
      };

      this.service.update(this.idEspecialidad, especialidad).subscribe({

        next: () => {

          Swal.fire(
            '¡Actualizado!',
            'Especialidad actualizada correctamente.',
            'success'
          );

          this.limpiar();
          this.listar();

        },

        error: () => {

          Swal.fire(
            'Error',
            'No se pudo actualizar la especialidad.',
            'error'
          );

        }

      });

    }
  }

  editar(especialidad: Especialidad): void {

    this.idEspecialidad = especialidad.idEspecialidad;
    this.nombre = especialidad.nombre;
    this.descripcion = especialidad.descripcion;
    this.estado = especialidad.estado;

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
      title: '¿Eliminar especialidad?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        this.service.delete(id).subscribe({

          next: () => {

            Swal.fire(
              '¡Eliminado!',
              'Especialidad eliminada correctamente.',
              'success'
            );

            this.listar();

          },

          error: () => {

            Swal.fire(
              'No se puede eliminar',
              'La especialidad está relacionada con uno o más doctores.',
              'error'
            );

          }

        });

      }

    });

  }

  especialidadesFiltradas(): Especialidad[] {

    return this.especialidades.filter(especialidad =>
      especialidad.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      especialidad.descripcion.toLowerCase().includes(this.filtro.toLowerCase())
    );

  }

  limpiar(): void {

    this.idEspecialidad = 0;
    this.nombre = '';
    this.descripcion = '';
    this.estado = true;

  }

}