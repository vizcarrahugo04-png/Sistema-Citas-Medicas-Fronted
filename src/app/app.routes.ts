import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/usuarios';
import { Doctores } from './pages/doctores/doctores';
import { Pacientes } from './pages/pacientes/pacientes';
import { authGuard } from './guards/auth.guard';
import { CitasMedicas } from './pages/citas-medicas/citas-medicas';
import { Roles } from './pages/roles/roles';
import { Consultorios } from './pages/consultorios/consultorios';
import { Especialidades } from './pages/especialidades/especialidades';
import { HorariosDoctor } from './pages/horarios-doctor/horarios-doctor';
import { HistorialCitas } from './pages/historial-citas/historial-citas';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [authGuard]
    },
    {
        path: 'doctores',
        component: Doctores,
        canActivate: [authGuard]
    },
    {
        path: 'pacientes',
        component: Pacientes,
        canActivate: [authGuard]
    },

    {
        path: 'roles',
        component: Roles,
        canActivate: [authGuard]
    },
    {
        path: 'consultorios',
        component: Consultorios,
        canActivate: [authGuard]
    },
    {
        path: 'especialidades',
        component: Especialidades,
        canActivate: [authGuard]
    },
    {
        path: 'horarios-doctor',
        component: HorariosDoctor,
        canActivate: [authGuard]
    },
    {
        path: 'historial-citas',
        component: HistorialCitas,
        canActivate: [authGuard]
    },
    {
        path: 'citas-medicas',
        component: CitasMedicas,
        canActivate: [authGuard]
    }
];