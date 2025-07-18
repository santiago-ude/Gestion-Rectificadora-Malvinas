import { Routes } from '@angular/router';
import { NavbarGuard } from './navbar.guard';

// Componentes
import { PageComponent } from './landingPage/page/page.component';
import { CuerpoComponent } from './landingPage/cuerpo/cuerpo.component';
import { ClienteListComponent } from './clientes/components/cliente-list/cliente-list.component';
import { ClienteAddComponent } from './clientes/components/cliente-add/cliente-add.component';
import { UpdatePageComponent } from './clientes/pages/update-page/update-page.component';
import { PedidosPageComponent } from './pedidos/pages/pedidos-page/pedidos-page.component';
import { ListPedidosPageComponent } from './pedidos/pages/list-pedidos-page/list-pedidos-page.component';
import { UpdatePedidosPageComponent } from './pedidos/pages/update-pedidos-page/update-pedidos-page.component';
import { PresupuestoPageComponent } from './presupuestos/pages/presupuesto-page/presupuesto-page.component';
import { PresupuestosUpdateComponent } from './presupuestos/components/presupuestos-update/presupuestos-update.component';
import { CalendarioPedidosComponent } from './pedidos/components/pedidos-calendario/pedidos-calendario.component';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      // Ruta principal (landing)
      { path: '', component: CuerpoComponent },

      // Clientes
      { path: 'clientes', component: ClienteListComponent, canActivate: [NavbarGuard] },
      { path: 'crearCliente', component: ClienteAddComponent, canActivate: [NavbarGuard] },
      { path: 'clientes/update/:id', component: UpdatePageComponent, canActivate: [NavbarGuard] },

      // Pedidos
      { path: 'pedidos', component: ListPedidosPageComponent, canActivate: [NavbarGuard] },
      { path: 'addPedido', component: PedidosPageComponent, canActivate: [NavbarGuard] },
      { path: 'pedidos/update/:id', component: UpdatePedidosPageComponent, canActivate: [NavbarGuard] },
      { path: 'calendario-pedidos', component: CalendarioPedidosComponent, canActivate: [NavbarGuard] },
      // Presupuestos
      { path: 'presupuestos', component: PresupuestoPageComponent, canActivate: [NavbarGuard] },
      { path: 'presupuestos/update/:id', component: PresupuestosUpdateComponent, canActivate: [NavbarGuard] },
      // Catch-all
      { path: '**', redirectTo: '' }
    ]
  }
];