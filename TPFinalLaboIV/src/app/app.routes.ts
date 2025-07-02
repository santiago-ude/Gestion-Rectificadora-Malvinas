import { UpdatePedidosPageComponent } from './pedidos/pages/update-pedidos-page/update-pedidos-page.component';
import { ClienteListComponent } from './clientes/components/cliente-list/cliente-list.component';
import { Routes } from '@angular/router';
import { ClienteAddComponent } from './clientes/components/cliente-add/cliente-add.component';
import { CuerpoComponent } from './landingPage/cuerpo/cuerpo.component';
import { PedidosPageComponent } from './pedidos/pages/pedidos-page/pedidos-page.component';
import { PresupuestoPageComponent } from './presupuestos/pages/presupuesto-page/presupuesto-page.component';
import { ListPedidosPageComponent } from './pedidos/pages/list-pedidos-page/list-pedidos-page.component';
import { UpdatePageComponent } from './clientes/pages/update-page/update-page.component';
import {NavbarGuard} from "./navbar.guard";
import { PageComponent } from './landingPage/page/page.component';

export const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      { path: '', component: CuerpoComponent },

      // Clientes
      { path: 'clientes', component: ClienteListComponent },
      { path: 'crearCliente', component: ClienteAddComponent },
      { path: 'clientes/update/:id', component: UpdatePageComponent },

      // Pedidos
      { path: 'pedidos', component: ListPedidosPageComponent },
      { path: 'addPedido', component: PedidosPageComponent },
      { path: 'pedidos/update/:id', component: UpdatePedidosPageComponent },

      // Presupuestos
      { path: 'presupuestos', component: PresupuestoPageComponent },

      // Inicio
      { path: '**', redirectTo: '' }
    ]
  }
];