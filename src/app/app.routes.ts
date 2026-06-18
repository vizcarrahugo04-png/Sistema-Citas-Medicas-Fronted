import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Usuarios } from './pages/usuarios/usuarios';
import { Doctores } from './pages/doctores/doctores';
import { Pacientes } from './pages/pacientes/pacientes';
import { authGuard } from './guards/auth.guard';

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
    }
];