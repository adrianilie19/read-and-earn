import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/service/ApiService/api.service';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './biblioteca.html',
  styleUrls: ['./biblioteca.css']
})
export class Biblioteca implements OnInit {

  libros: any[] = [];
  librosFiltrados: any[] = [];
  terminoBusqueda = '';
  filtroEstado = 'todos';
  cargando = true;
  error = '';
  libroEditando: any = null;
  progresoTemporal = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarBiblioteca();
  }

  cargarBiblioteca() {
    this.cargando = true;
    this.error = '';
    this.api.getBiblioteca().subscribe({
      next: (res: any) => {
        this.libros = res.data;
        this.librosFiltrados = res.data;
        this.cargando = false;
      },
      error: () => {
        this.cargarDesdeLocal();
      }
    });
  }

  cargarDesdeLocal() {
    const datos = JSON.parse(localStorage.getItem('biblioteca') || '[]');
    this.libros = datos.map((l: any) => ({
      id: l.id,
      gutendex_id: l.id,
      titulo: l.title || l.titulo,
      autor: l.authors?.[0]?.name || l.autor || 'Autor desconocido',
      portada_url: l.cover_image || l.portada_url || '',
      progreso: l.progress || l.progreso || 0,
      estado: l.status || l.estado || 'Por comenzar'
    }));
    this.librosFiltrados = [...this.libros];
    this.cargando = false;
  }

  setFiltroEstado(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  filtrarLibros() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.libros];
    if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(l => l.estado === this.filtroEstado);
    }
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(l =>
          l.titulo.toLowerCase().includes(termino) ||
          l.autor.toLowerCase().includes(termino)
      );
    }
    this.librosFiltrados = resultado;
  }

  abrirProgreso(libro: any) {
    this.libroEditando = libro;
    this.progresoTemporal = libro.progreso;
  }

  cerrarProgreso() {
    this.libroEditando = null;
  }

  guardarProgreso() {
    if (!this.libroEditando) return;
    this.api.actualizarProgreso(this.libroEditando.id, this.progresoTemporal).subscribe({
      next: (res: any) => {
        this.libroEditando.progreso = res.progreso;
        this.libroEditando.estado = res.estado;
        this.aplicarFiltros();
        this.cerrarProgreso();
      },
      error: () => {
        alert('Error al actualizar el progreso');
      }
    });
  }

  eliminarLibro(libro: any) {
    this.api.eliminarLibro(libro.id).subscribe({
      next: () => {
        this.libros = this.libros.filter(l => l.id !== libro.id);
        this.aplicarFiltros();
      },
      error: () => {
        alert('Error al eliminar el libro');
      }
    });
  }

  get porComenzar() { return this.libros.filter(l => l.estado === 'Por comenzar').length; }
  get enProgreso() { return this.libros.filter(l => l.estado === 'En progreso').length; }
  get completados() { return this.libros.filter(l => l.estado === 'Completado').length; }

}