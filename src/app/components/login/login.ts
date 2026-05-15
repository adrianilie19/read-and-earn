import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  isLogin = true;

  loginEmail = '';
  loginPassword = '';
  loginError = '';
  loginCargando = false;

  registerNombre = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';
  registerError = '';
  registerCargando = false;

  mensajeGuard = '';
  returnUrl = '/biblioteca';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/biblioteca';
    if (this.route.snapshot.queryParams['returnUrl']) {
      this.mensajeGuard = 'Debes iniciar sesión para acceder a esa sección.';
    }
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.loginError = '';
    this.registerError = '';
  }

  onLogin() {
    this.loginError = '';

    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Por favor completa todos los campos';
      return;
    }

    this.loginCargando = true;

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (res: any) => {
        this.loginCargando = false;
        this.authService.guardarSesion(res.data);
        this.router.navigate([this.returnUrl]);
      },
      error: (err: any) => {
        this.loginCargando = false;
        const errores = err.error?.erroresBackend;
        this.loginError = errores ? errores[0] : 'Email o contraseña incorrectos';
      }
    });
  }

  onRegister() {
    this.registerError = '';

    if (!this.registerNombre || !this.registerEmail || !this.registerPassword || !this.registerPasswordConfirm) {
      this.registerError = 'Por favor completa todos los campos';
      return;
    }

    if (this.registerPassword !== this.registerPasswordConfirm) {
      this.registerError = 'Las contraseñas no coinciden';
      return;
    }

    this.registerCargando = true;

    this.authService.register(
      this.registerNombre,
      this.registerEmail,
      this.registerPassword,
      this.registerPasswordConfirm
    ).subscribe({
      next: () => {
        this.authService.login(this.registerEmail, this.registerPassword).subscribe({
          next: (res: any) => {
            this.registerCargando = false;
            this.authService.guardarSesion(res.data);
            this.router.navigate([this.returnUrl]);
          },
          error: () => {
            this.registerCargando = false;
            this.isLogin = true;
          }
        });
      },
      error: (err: any) => {
        this.registerCargando = false;
        const errores = err.error?.erroresBackend;
        this.registerError = errores ? errores[0] : 'Error al registrarse';
      }
    });
  }
}
