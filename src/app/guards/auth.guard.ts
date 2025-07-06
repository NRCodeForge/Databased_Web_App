import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Ist der Benutzer überhaupt angemeldet?
  if (!authService.isLoggedIn()) {
    // Nicht angemeldet -> zum Login weiterleiten
    router.navigate(['/login']);
    return false;
  }

  // 2. Hat der Benutzer die erforderliche Rolle?
  // Wir lesen die erwartete Rolle aus den Routen-Daten
  const expectedRole = route.data['role'];
  const userRole = authService.getUserRole();

  if (!expectedRole || userRole === expectedRole) {
    // Wenn keine spezielle Rolle erwartet wird oder die Rolle passt -> Zugriff erlauben
    console.log(userRole);
    return true;
  }

  // 3. Rolle passt nicht -> Zugriff verweigern und umleiten
  alert('Zugriff verweigert! Sie haben nicht die erforderliche Rolle.');
  router.navigate(['/']); // Zur Startseite weiterleiten
  return false;
};
