import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";

import { ConsultorioService } from "../../services/consultorio";
import { Consultorio } from "../../models/consultorio";

@Component({
  selector: 'app-consultorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultorios.html',
  styleUrl: './consultorios.css'
})
export class Consultorios implements OnInit {

  private service = inject(ConsultorioService);
  private cdr = inject(ChangeDetectorRef);

  consultorios: Consultorio[] = [];

  idConsultorio = 0;
  numero = '';
  ubicacion = '';
  piso = 1;
  estado = true;
  filtro = '';

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.service.findAll().subscribe({
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
    if (this.idConsultorio === 0) {
      const consultorio = {
        numero: this.numero,
        ubicacion: this.ubicacion,
        piso: this.piso,
        estado: this.estado
      };

      this.service.save(consultorio).subscribe({
        next: () => {
          Swal.fire('¡Correcto!', 'Consultorio registrado correctamente.', 'success');
          this.limpiar();
          this.listar();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el consultorio.', 'error');
        }
      });

    } else {
      const consultorio: Consultorio = {
        idConsultorio: this.idConsultorio,
        numero: this.numero,
        ubicacion: this.ubicacion,
        piso: this.piso,
        estado: this.estado
      };

      this.service.update(this.idConsultorio, consultorio).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Consultorio actualizado correctamente.', 'success');
          this.limpiar();
          this.listar();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el consultorio.', 'error');
        }
      });
    }
  }

  editar(consultorio: Consultorio): void {
    this.idConsultorio = consultorio.idConsultorio;
    this.numero = consultorio.numero;
    this.ubicacion = consultorio.ubicacion;
    this.piso = consultorio.piso;
    this.estado = consultorio.estado;

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
      title: '¿Eliminar consultorio?',
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
            Swal.fire('¡Eliminado!', 'Consultorio eliminado correctamente.', 'success');
            this.listar();
          },
          error: () => {
            Swal.fire(
              'No se puede eliminar',
              'Este consultorio está relacionado con una o más citas.',
              'error'
            );
          }
        });
      }
    });
  }

  consultoriosFiltrados(): Consultorio[] {
    return this.consultorios.filter(consultorio =>
      consultorio.numero.toLowerCase().includes(this.filtro.toLowerCase()) ||
      consultorio.ubicacion.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  limpiar(): void {
    this.idConsultorio = 0;
    this.numero = '';
    this.ubicacion = '';
    this.piso = 1;
    this.estado = true;
  }
}