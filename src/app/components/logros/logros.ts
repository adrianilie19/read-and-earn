import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/service/ApiService/api.service';

const LOGROS_LOCAL = [
  { id: 1, titulo: 'Lee 10 minutos', descripcion: 'Lee durante 10 minutos seguidos', exp: 20, icono: '⏱️', completado: false },
  { id: 2, titulo: 'Lee 2 libros', descripcion: 'Completa la lectura de 2 libros', exp: 200, icono: '📚', completado: false },
  { id: 3, titulo: 'Inicia sesión 7 días', descripcion: 'Inicia sesión durante 7 días consecutivos', exp: 50, icono: '📅', completado: false },
  { id: 4, titulo: 'Supera a un amigo', descripcion: 'Supera el porcentaje de lectura de un amigo', exp: 100, icono: '🏆', completado: false },
  { id: 5, titulo: 'Lector nocturno', descripcion: 'Lee después de las 10 PM', exp: 30, icono: '🌙', completado: false },
  { id: 6, titulo: 'Coleccionista', descripcion: 'Agrega 10 libros a tu biblioteca', exp: 150, icono: '📖', completado: false },
];

@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logros.html',
  styleUrls: ['./logros.css']
})
export class Logros implements OnInit {

  logros: any[] = [];
  cargando = true;
  error = '';
  filtro = 'todos';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getLogros().subscribe({
      next: (res: any) => {
        this.logros = res.data;
        this.cargando = false;
      },
      error: () => {
        this.logros = LOGROS_LOCAL;
        this.cargando = false;
      }
    });
  }

  setFiltro(f: string) {
    this.filtro = f;
  }

  get logrosFiltrados() {
    if (this.filtro === 'pendientes') return this.logros.filter(l => !l.completado);
    if (this.filtro === 'completados') return this.logros.filter(l => l.completado);
    return this.logros;
  }

  get totalCompletados() {
    return this.logros.filter(l => l.completado).length;
  }
}
