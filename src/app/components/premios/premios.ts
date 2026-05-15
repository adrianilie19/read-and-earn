import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/service/ApiService/api.service';
import { AuthService } from '../../core/service/auth.service';

const PREMIOS_LOCAL = [
  { id: 1, titulo: 'El señor de las moscas', autor: 'William Golding', coste_exp: 2000, stock: 5, portada_url: 'https://covers.openlibrary.org/b/title/lord-of-the-flies-L.jpg', disponible: true },
  { id: 2, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', coste_exp: 1500, stock: 0, portada_url: 'https://covers.openlibrary.org/b/title/one-hundred-years-of-solitude-L.jpg', disponible: false },
  { id: 3, titulo: '1984', autor: 'George Orwell', coste_exp: 1800, stock: 3, portada_url: 'https://covers.openlibrary.org/b/title/1984-L.jpg', disponible: true },
  { id: 4, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', coste_exp: 2500, stock: 2, portada_url: 'https://covers.openlibrary.org/b/title/don-quixote-L.jpg', disponible: true },
  { id: 5, titulo: 'Orgullo y prejuicio', autor: 'Jane Austen', coste_exp: 1200, stock: 0, portada_url: 'https://covers.openlibrary.org/b/title/pride-and-prejudice-L.jpg', disponible: false },
  { id: 6, titulo: 'El gran Gatsby', autor: 'F. Scott Fitzgerald', coste_exp: 1600, stock: 4, portada_url: 'https://covers.openlibrary.org/b/title/the-great-gatsby-L.jpg', disponible: true },
];

@Component({
  selector: 'app-premios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premios.html',
  styleUrls: ['./premios.css']
})
export class Premios implements OnInit {

  premios: any[] = [];
  cargando = true;
  mensajeExito = '';
  mensajeError = '';
  backendActivo = false;

  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.api.getPremios().subscribe({
      next: (res: any) => {
        this.premios = res.data;
        this.backendActivo = true;
        this.cargando = false;
      },
      error: () => {
        this.premios = PREMIOS_LOCAL;
        this.backendActivo = false;
        this.cargando = false;
      }
    });
  }

  canjearPremio(premio: any) {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.authService.isLoggedIn()) {
      this.mensajeError = 'Debes iniciar sesión para canjear premios.';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }

    if (!this.backendActivo) {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      if (user.exp < premio.coste_exp) {
        this.mensajeError = 'Te faltan ' + (premio.coste_exp - user.exp) + ' EXP para este premio.';
        setTimeout(() => this.mensajeError = '', 3000);
        return;
      }

      user.exp -= premio.coste_exp;
      user.nivel = Math.floor(user.exp / 100) + 1;
      this.authService.actualizarUsuario(user);
      premio.stock -= 1;
      if (premio.stock <= 0) premio.disponible = false;
      this.mensajeExito = '¡Has canjeado "' + premio.titulo + '" con éxito!';
      setTimeout(() => this.mensajeExito = '', 3000);
      return;
    }

    this.api.canjearPremio(premio.id).subscribe({
      next: (res: any) => {
        this.mensajeExito = '¡Has canjeado "' + premio.titulo + '" con éxito!';
        setTimeout(() => this.mensajeExito = '', 3000);

        const user = this.authService.getCurrentUser();
        if (user) {
          user.exp = res.exp_restante;
          user.nivel = Math.floor(res.exp_restante / 100) + 1;
          this.authService.actualizarUsuario(user);
        }

        premio.stock -= 1;
        if (premio.stock <= 0) premio.disponible = false;
      },
      error: (err: any) => {
        const errores = err.error?.erroresBackend;
        this.mensajeError = errores ? errores[0] : 'Error al canjear el premio';
        setTimeout(() => this.mensajeError = '', 3000);
      }
    });
  }

  getExpUsuario() {
    return this.authService.getCurrentUser()?.exp || 0;
  }
}
