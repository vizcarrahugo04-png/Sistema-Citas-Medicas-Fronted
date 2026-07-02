import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConsultorioService } from "../../services/consultorio";
import { Consultorio } from "../../models/consultorio";

@Component({
  selector:'app-consultorios',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl:'./consultorios.html',
  styleUrl:'./consultorios.css'
})
export class Consultorios implements OnInit {

  private service = inject(ConsultorioService);
  private cdr = inject(ChangeDetectorRef);

  consultorios: Consultorio[] = [];

  idConsultorio: number = 0;
  numero: string = '';
  ubicacion: string = '';
  piso: number = 1;
  estado: boolean = true;
  filtro: string = '';

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.service.findAll().subscribe({
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

    if (this.idConsultorio === 0) {

      const consultorio = {
        numero: this.numero,
        ubicacion: this.ubicacion,
        piso: this.piso,
        estado: this.estado
      };

      this.service.save(consultorio).subscribe(() => {
        alert('Consultorio registrado correctamente');
        this.limpiar();
        this.listar();
      });

    } else {

      const consultorio: Consultorio = {
        idConsultorio: this.idConsultorio,
        numero: this.numero,
        ubicacion: this.ubicacion,
        piso: this.piso,
        estado: this.estado
      };

      this.service.update(this.idConsultorio, consultorio).subscribe(() => {
        alert('Consultorio actualizado correctamente');
        this.limpiar();
        this.listar();
      });
    }
  }

  editar(consultorio: Consultorio): void {
    this.idConsultorio = consultorio.idConsultorio;
    this.numero = consultorio.numero;
    this.ubicacion = consultorio.ubicacion;
    this.piso = consultorio.piso;
    this.estado = consultorio.estado;
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este consultorio?')) {
      this.service.delete(id).subscribe(() => {
        alert('Consultorio eliminado correctamente');
        this.listar();
      });
    }
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