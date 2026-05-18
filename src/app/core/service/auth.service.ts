import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface User {
  nombre: string;
  email: string;
  nivel: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = 'https://read-and-earn-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  guardarSesion(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify({
      nombre: data.nombre,
      email: data.email,
      nivel: data.nivel,
      exp: data.exp
    }));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  register(nombre: string, email: string, password1: string, password2: string) {
    return this.http.post(`${this.url}/registro/`, { nombre, email, password1, password2 });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.url}/login/`, { email, password });
  }

  actualizarUsuario(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
