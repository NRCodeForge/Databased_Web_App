import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard Funktion zum Schutz von Routen.
 * Prüft, ob der Benutzer angemeldet ist und die erforderliche Rolle besitzt.
 * 
 * @param {ActivatedRouteSnapshot} route Aktuelle Route mit den Metadaten.
 * @param {*} state Zustand der Navigation (nicht verwendet).
 * @returns {boolean} true, wenn Zugriff erlaubt, sonst false.
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Überprüfen, ob der Benutzer angemeldet ist.
  if (!authService.isLoggedIn()) {
    // Benutzer nicht angemeldet, Weiterleitung zur Login-Seite.
    router.navigate(['/login']);
    return false;
  }

  // 2. Überprüfen, ob der Benutzer die erforderliche Rolle besitzt.
  const expectedRole = route.data['role'];
  const userRole = authService.getUserRole();

  if (!expectedRole || userRole === expectedRole) {
    // Keine spezifische Rolle erforderlich oder Rolle passt -> Zugriff erlauben.
    console.log(userRole);
    return true;
  }

  // 3. Rolle passt nicht -> Zugriff verweigern und Benutzer weiterleiten.
  alert('Zugriff verweigert! Sie haben nicht die erforderliche Rolle.');
  router.navigate(['/']); // Weiterleitung zur Startseite
  return false;
};
