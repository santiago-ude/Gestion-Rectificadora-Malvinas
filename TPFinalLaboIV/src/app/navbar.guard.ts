import {
  ActivatedRouteSnapshot, CanActivate,
  GuardResult,
  MaybeAsync,
  NavigationStart,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class NavbarGuard implements CanActivate
{
  // Mantenemos un registro de si se ha usado la barra de navegación
  private wasNavbarUsed = false;
  // Declaramos una variable que será utilizada para almacenar el router inyectado
  private router: Router;

  //Pedimos un router
  constructor(private routerService: Router) {
    this.router = routerService;

    // Nos suscribimos a los eventos de navegación
    this.router.events.subscribe(event => {
      // Si el evento es de navegación, actualizamos la variable
      if (event instanceof NavigationStart) {
        this.wasNavbarUsed = true;
      }
    });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (!this.wasNavbarUsed) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
