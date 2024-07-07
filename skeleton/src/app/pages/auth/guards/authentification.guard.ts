import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../authentification.service';

export function AuthentificationGuard(): boolean {
  const authentificationService = inject(AuthentificationService);
  const router = inject(Router);

  if (!authentificationService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
}
