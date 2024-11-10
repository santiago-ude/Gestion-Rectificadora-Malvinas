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

export const routes: Routes = [

    //Presupuestos
    {path: 'presupuestos', component: PresupuestoPageComponent, canActivate: [NavbarGuard]},

    //Clientes
    {path: 'crearCliente', component: ClienteAddComponent, canActivate: [NavbarGuard]},
    {path: 'clientes', component: ClienteListComponent, canActivate: [NavbarGuard]},
    {path: 'clientes/update/:id', component: UpdatePageComponent, canActivate: [NavbarGuard]},


    //Pedidos
    {path: 'addPedido', component: PedidosPageComponent, canActivate: [NavbarGuard]},
    {path: 'pedidos', component: ListPedidosPageComponent, canActivate: [NavbarGuard]},
    {path: 'addPedidos', component: PedidosPageComponent, canActivate: [NavbarGuard]},
    {path: "pedidos/update/:id", component: UpdatePedidosPageComponent, canActivate: [NavbarGuard]},
    
    //Por Defecto
    {path: '', component: CuerpoComponent},
    {path: '**', redirectTo: ''},
    
];
