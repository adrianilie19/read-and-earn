import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibrosService, Libro } from '../../core/service/LibrosService/libros-services.service';
import { ApiService } from '../../core/service/ApiService/api.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-descubrir',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './descubrir.html',
  styleUrls: ['./descubrir.css']
})
export class DescubrirComponent implements OnInit {

  libros: Libro[] = [];
  cargando = true;
  error = '';
  terminoBusqueda = '';
  paginaActual = 1;
  idsAgregados: number[] = [];
  cache: { [pagina: number]: Libro[] } = {};
  mensajeLogro = '';

  constructor(
      private librosService: LibrosService,
      private api: ApiService,
      private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarLibros();

    if (this.authService.isLoggedIn()) {
      this.api.getBiblioteca().subscribe({
        next: (res: any) => {
          this.idsAgregados = res.data.map((l: any) => l.gutendex_id);
        },
        error: () => {
          this.idsAgregados = [];
        }
      });
    } else {
      this.idsAgregados = [];
    }
  }

  cargarLibros() {
    if (this.cache[this.paginaActual]) {
      this.libros = this.cache[this.paginaActual];
      this.cargando = false;
      return;
    }

    this.cargando = true;
    this.error = '';

    this.librosService.obtenerLibrosPorPagina(this.paginaActual).subscribe({
      next: (data) => {
        this.libros = data;
        this.cache[this.paginaActual] = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar los libros. Por favor, intenta de nuevo.';
        this.cargando = false;
      }
    });
  }

  buscar() {
    if (!this.terminoBusqueda.trim()) {
      this.paginaActual = 1;
      this.cargarLibros();
      return;
    }
    this.cargando = true;
    this.error = '';
    this.librosService.buscarLibros(this.terminoBusqueda).subscribe({
      next: (data) => { this.libros = data; this.cargando = false; },
      error: () => { this.error = 'Error al buscar libros.'; this.cargando = false; }
    });
  }

  paginaSiguiente() { this.paginaActual++; this.cargarLibros(); }
  paginaAnterior() { if (this.paginaActual > 1) { this.paginaActual--; this.cargarLibros(); } }

  yaAgregado(libro: Libro): boolean {
    return this.idsAgregados.includes(libro.id);
  }

  agregarABiblioteca(libro: Libro) {
    if (this.yaAgregado(libro)) return;

    const autor = libro.authors[0]?.name || '';
    const portada = libro.cover_image || '';

    if (this.authService.isLoggedIn()) {
      this.api.agregarLibro(libro.id, libro.title, autor, portada).subscribe({
        next: (res: any) => {
          this.idsAgregados.push(libro.id);

          if (res.logros_desbloqueados && res.logros_desbloqueados.length > 0) {
            this.mensajeLogro = '🏆 ¡Logro desbloqueado: ' + res.logros_desbloqueados.join(', ') + '! +EXP';
            setTimeout(() => this.mensajeLogro = '', 4000);

            const user = this.authService.getCurrentUser();
            if (user && res.exp !== undefined) {
              user.exp = res.exp;
              user.nivel = res.nivel;
              this.authService.actualizarUsuario(user);
            }
          }
        },
        error: (err: any) => {
          if (err.status === 0) {
            this.guardarEnLocal(libro);
          } else {
            const msg = err.error?.erroresBackend?.[0] || 'Error al agregar el libro';
            alert(msg);
          }
        }
      });
    } else {
      this.guardarEnLocal(libro);
    }
  }

  guardarEnLocal(libro: Libro) {
    const biblioteca = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    const yaEsta = biblioteca.some((l: any) => l.id === libro.id);
    if (!yaEsta) {
      biblioteca.push({ ...libro, status: 'Por comenzar', progress: 0 });
      localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
    }
    this.idsAgregados.push(libro.id);
  }
}