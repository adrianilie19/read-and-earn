import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './configuracion.html',
    styleUrls: ['./configuracion.css']
})
export class Configuracion {

    seccionActiva = 'perfil';

    setSeccion(seccion: string) {
        this.seccionActiva = seccion;
    }

    notificacionesEmail = true;
    notificacionesLogros = true;
    notificacionesAmigos = false;
    perfilPublico = true;
    mostrarEXP = true;
    mostrarBiblioteca = false;
}