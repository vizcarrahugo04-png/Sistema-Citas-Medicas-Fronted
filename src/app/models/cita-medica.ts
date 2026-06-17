export interface CitaMedica { 
    idCita: number;
    fecha: string;
    hora: string;
    motivo:string;
    estado:string;
    idPaciente: number;
    idDoctor: number;
    idHorario:number;
    idConsultorio:number;
}