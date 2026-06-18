import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PacienteService } from "../../services/paciente";
import { UsuarioService } from "../../services/usuario";
import { Paciente } from "../../models/paciente";
import { Usuario } from "../../models/usuario";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";


@Component({
  selector:'app-pacientes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl:'./pacientes.html',
  styleUrl:'./pacientes.css'
})
export class Pacientes implements OnInit{

  private pacienteService = inject(PacienteService);
  private UsuarioService = inject(UsuarioService);
  private router = inject(Router);
  private authService = inject(AuthService);

  pacientes: Paciente[]=[];
  usuarios: Usuario[]=[];

  idPaciente: number = 0;
  nombres:string='';
  apellidos:string='';
  dni:string='';
  telefono:string='';
  direccion:string='';
  fechaNacimiento:string='';
  sexo:string='';
  estado:boolean=true;
  idUsuario:number=0;
  
  ngOnInit(): void {
    this.listarUsuarios();
    this.ListarPacientes();
  }

  ListarPacientes(): void {
    this.pacienteService.findAll().subscribe(data =>{
      this.pacientes=data._embedded.pacienteDTOList;
    });
  }

  listarUsuarios():void{
    this.UsuarioService.findAll().subscribe(data=>{
      this.usuarios=data._embedded.usuarioDTOList;
    })
  }

  guardar():void{
    
    if(this.idPaciente === 0){
      const paciente = {
        nombres: this.nombres,
        apellidos: this.apellidos,
        dni: this.dni,
        telefono: this.telefono,
        direccion: this.direccion,
        fechaNacimiento: this.fechaNacimiento,
        sexo: this.sexo,
        estado:this.estado,
        idUsuario: this.idUsuario
      };

      this.pacienteService.save(paciente).subscribe(()=>{
        alert('Paciente registrado correctamente');
        this.limpiar();
        this.ListarPacientes();
      });
    }else{
      const paciente:Paciente = {
        idPaciente: this.idPaciente,
        nombres:this.nombres,
        apellidos:this.apellidos,
        dni:this.dni,
        telefono:this.telefono,
        direccion:this.direccion,
        fechaNacimiento: this.fechaNacimiento,
        sexo: this.sexo,
        estado: this.estado,
        idUsuario: this.idUsuario
      };

      this.pacienteService.update(this.idPaciente, paciente).subscribe(()=>{
        alert('Paciente actualizado correctamente');
        this.limpiar();
        this.ListarPacientes();
      })
    }
  }

  editar(paciente:Paciente):void{
    this.idPaciente= paciente.idPaciente;
    this.nombres= paciente.nombres;
    this.apellidos= paciente.apellidos;
    this.dni= paciente.dni;
    this.telefono= paciente.telefono;
    this.direccion= paciente.direccion;
    this.fechaNacimiento = paciente.fechaNacimiento;
    this.sexo = paciente.sexo;
    this.estado = paciente.estado;
    this.idUsuario = paciente.idUsuario;
  }

  eliminar(id:number): void{
    if(confirm('¿Seguro que deseas eliminar este paciente?')){
      this.pacienteService.delete(id).subscribe(()=>{
        alert('Paciente eliminado correctamente');
        this.ListarPacientes();
      })
    }
  }

  limpiar():void{
    this.idPaciente=0;
    this.nombres='';
    this.apellidos='';
    this.dni='';
    this.telefono='';
    this.direccion='';
    this.fechaNacimiento='';
    this.sexo='';
    this.estado=true;
    this.idUsuario=0;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}