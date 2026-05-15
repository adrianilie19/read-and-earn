import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  alert('Necesitas iniciar sesión para acceder a esta sección.');
  router.navigate(['/login'], { queryParams: { returnUrl: '/logros' } });
  return false;
};
