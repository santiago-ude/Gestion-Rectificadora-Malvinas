import { ClienteListComponent } from './clientes/components/cliente-list/cliente-list.component';
import { Routes } from '@angular/router';
import { PresupuestosListComponent } from './presupuestos/components/presupuestos-list/presupuestos-list.component';
import { ClienteAddComponent } from './clientes/components/cliente-add/cliente-add.component';
import { MenuComponent } from './landingPage/menu/menu.component';
import { CuerpoComponent } from './landingPage/cuerpo/cuerpo.component';
import { PedidosPageComponent } from './pedidos/pages/pedidos-page/pedidos-page.component';
import { UpdatePageComponent } from './pedidos/pages/update-page/update-page.component';
import { PresupuestoPageComponent } from './presupuestos/pages/presupuesto-page/presupuesto-page.component';
import { ListPedidosPageComponent } from './pedidos/pages/list-pedidos-page/list-pedidos-page.component';

export const routes: Routes = [

    //Presupuestos
    {path: 'presupuestos', component: PresupuestoPageComponent},

    //Clientes
    {path: 'crearCliente', component: ClienteAddComponent},
    {path: 'clientes', component: ClienteListComponent},

    //Pedidos
    {path: 'addPedido', component: PedidosPageComponent},
    {path: 'pedidos', component: ListPedidosPageComponent},
    {path: "pedidos/update/:id", component: UpdatePageComponent},
    
    //Por Defecto
    {path: '', component: CuerpoComponent},
    {path: '**', redirectTo: ''},
    
];
