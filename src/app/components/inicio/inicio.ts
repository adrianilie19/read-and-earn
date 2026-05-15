import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.html',
    imports: [RouterLink],
    styleUrls: ['./inicio.css']
})
export class Inicio {}
