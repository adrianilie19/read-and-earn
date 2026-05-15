import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private url = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
    });
  }

  getBiblioteca() {
    return this.http.get(`${this.url}/biblioteca/`, { headers: this.headers() });
  }

  agregarLibro(gutendex_id: number, titulo: string, autor: string, portada_url: string) {
    return this.http.post(`${this.url}/biblioteca/`, { gutendex_id, titulo, autor, portada_url }, { headers: this.headers() });
  }

  eliminarLibro(id: number) {
    return this.http.delete(`${this.url}/biblioteca/${id}/`, { headers: this.headers() });
  }

  actualizarProgreso(id: number, progreso: number) {
    return this.http.patch(`${this.url}/biblioteca/${id}/`, { progreso }, { headers: this.headers() });
  }

  getLogros() {
    return this.http.get(`${this.url}/logros/`, { headers: this.headers() });
  }

  getPremios() {
    return this.http.get(`${this.url}/premios/`);
  }

  canjearPremio(id: number) {
    return this.http.post(`${this.url}/premios/${id}/canjear/`, {}, { headers: this.headers() });
  }
}
