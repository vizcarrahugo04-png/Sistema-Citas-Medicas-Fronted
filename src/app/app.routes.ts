import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/usuarios';
import { Doctores } from './pages/doctores/doctores';
import { Pacientes } from './pages/pacientes/pacientes';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'usuarios',
        component: Usuarios
    },
    {
        path: 'doctores',
        component: Doctores
    },
    {
        path: 'pacientes',
        component: Pacientes
    }
];