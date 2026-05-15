import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Libro {
  cover_image?: string;
  title: string;
  authors: Array<{ name: string }>;
  status?: string;
  progress?: number;
  id: number;
  generos?: string[];
  enlace_descarga?: string;
  contenido_url?: string;
  descripcion?: string;
  paginas?: number | string;
  download_count?: number;
}

export interface GutendexResponse {
  count: number;
  next?: string;
  previous?: string;
  results: any[];
}

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private GUTENDEX_URL = 'https://gutendex.com/books';

  constructor(private http: HttpClient) {}

  private mapLibro(libro: any): Libro {
    return {
      id: libro.id,
      title: libro.title,
      authors: libro.authors.map((author: any) => ({ name: author.name })),
      cover_image: libro.formats?.['image/jpeg'] || libro.formats?.['image/jpg'] || undefined,
      status: 'Por comenzar',
      progress: 0,
      download_count: libro.download_count,
      generos: libro.subjects ? libro.subjects.slice(0, 3) : [],
      descripcion: libro.title,
      paginas: 'N/A',
      enlace_descarga: libro.formats?.['application/epub+zip'] || '',
      contenido_url: libro.formats?.['text/html'] || libro.formats?.['text/plain; charset=utf-8'] || ''
    };
  }

  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<GutendexResponse>(this.GUTENDEX_URL).pipe(
      map(response => response.results.map(libro => this.mapLibro(libro)))
    );
  }

  obtenerLibrosPorPagina(pagina: number): Observable<Libro[]> {
    return this.http.get<GutendexResponse>(`${this.GUTENDEX_URL}?page=${pagina}`).pipe(
      map(response => response.results.map(libro => this.mapLibro(libro)))
    );
  }

  buscarLibros(termino: string): Observable<Libro[]> {
    return this.http.get<GutendexResponse>(`${this.GUTENDEX_URL}?search=${encodeURIComponent(termino)}`).pipe(
      map(response => response.results.map(libro => this.mapLibro(libro)))
    );
  }
}
