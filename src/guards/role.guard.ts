import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!requiredRoles?.length) {
      return true;
    }

    const hasAccess = requiredRoles.some(role => 
      this.authService.hasRequiredRole(role)
    );

    if (!hasAccess) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}
