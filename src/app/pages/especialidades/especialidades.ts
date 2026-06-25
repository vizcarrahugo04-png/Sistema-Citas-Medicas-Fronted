import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EspecialidadService } from "../../services/especialidad";
import { Especialidad } from '../../models/especialidad';

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

  idEspecialidad: number = 0;
  nombre: string = '';
  descripcion: string = '';
  estado: boolean = true;

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.service.findAll().subscribe({
      next: (data) => {
        this.especialidades = data._embedded?.especialidadDTOList || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error al listar especialidades:', error);
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

      this.service.save(especialidad).subscribe(() => {
        alert('Especialidad registrada correctamente');
        this.limpiar();
        this.listar();
      });

    } else {

      const especialidad: Especialidad = {
        idEspecialidad: this.idEspecialidad,
        nombre: this.nombre,
        descripcion: this.descripcion,
        estado: this.estado
      };

      this.service.update(this.idEspecialidad, especialidad).subscribe(() => {
        alert('Especialidad actualizada correctamente');
        this.limpiar();
        this.listar();
      });
    }
  }

  editar(especialidad: Especialidad): void {
    this.idEspecialidad = especialidad.idEspecialidad;
    this.nombre = especialidad.nombre;
    this.descripcion = especialidad.descripcion;
    this.estado = especialidad.estado;
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta especialidad?')) {
      this.service.delete(id).subscribe(() => {
        alert('Especialidad eliminada correctamente');
        this.listar();
      });
    }
  }

  limpiar(): void {
    this.idEspecialidad = 0;
    this.nombre = '';
    this.descripcion = '';
    this.estado = true;
  }
}