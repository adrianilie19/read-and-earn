import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Login } from './components/login/login';
import { DescubrirComponent } from './components/descubrir/descubrir';
import { Biblioteca } from './components/biblioteca/biblioteca';
import { Logros } from './components/logros/logros';
import { Premios } from './components/premios/premios';
import { authGuard } from './core/guards/auth.guard';
import { Configuracion } from './components/configuracion/configuracion';

export const routes: Routes = [
    { path: '', component: Inicio },
    { path: 'login', component: Login },
    { path: 'descubrir', component: DescubrirComponent },
    { path: 'biblioteca', component: Biblioteca },
    { path: 'logros', component: Logros, canActivate: [authGuard] },
    { path: 'premios', component: Premios },
    { path: 'configuracion', component: Configuracion },
    { path: '**', redirectTo: ''},
];
