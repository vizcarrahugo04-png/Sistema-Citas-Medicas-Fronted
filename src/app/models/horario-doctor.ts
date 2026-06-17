export interface HorarioDoctor {
    idHorario: number;
    dia: string;
    horaInicio: string;
    horaFin: string;
    cuposDisponibles:number;
    estado: boolean;
    idDoctor:number;
}