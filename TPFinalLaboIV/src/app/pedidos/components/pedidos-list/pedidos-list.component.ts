import { Component, inject } from '@angular/core';
import { PedidoService } from '../../service/pedidos.service';
import { Pedidos } from '../../interface/pedidos';
import jsPDF from 'jspdf';
import { RouterModule } from '@angular/router';
import {  CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WhatsappService } from '../../service/whatsapp.service';
import { WhatsappModalComponent } from '../../../shared/modals/whatsapp-modal/whatsapp-modal.component';
import { MatDialog} from '@angular/material/dialog';
import { PedidosCercanosModalComponent } from '../../../shared/modals/pedidos-cercanos-modal/pedidos-cercanos-modal.component';
import {DialogoGenericoComponent} from "../../../shared/modals/dialogo-generico/dialogo-generico.component";
import { ModalConfirmacionComponent } from '../../../shared/modals/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [RouterModule, DatePipe, FormsModule, CommonModule],
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']
})


export class PedidosListComponent {

  //Recorre los pedidos
  trackById(index: number, pedido: Pedidos): Number | null | undefined {
    return pedido.id;
  }

  //INYECCIONES

  //Servicio de pedidos
  ts = inject(PedidoService);

//Servcio de Whatsapp
  whatsappService = inject(WhatsappService);
  
  //Servicio para los dialogs
  dialog = inject(MatDialog);
  
  //Sericio para generar dialogos generics
  dialogoGenerico = inject(DialogoGenericoComponent);


  //Colecciones y Variables auxiliares para el listado y el filtrado
  listaPedidos: Pedidos[] = [];
  pedidosFiltrados: Pedidos[] = [];
  estadoSeleccionado: string = '';
  fechaInicio: string = ''; 
  fechaFin: string = ''; 
  clienteFiltro: string = '';
  diasParaFinalizar = 4; 
  pedidosCercanos: Pedidos[] = [];


  //Inicializacin
  ngOnInit(){
    this.listarPedidos();
  }


  //Ejecuta la request GET
  listarPedidos() {

    //Obtien los pedidos 
    this.ts.getPedidos().subscribe({
      next: (pedidos: Pedidos[]) => {

        this.listaPedidos = pedidos;
        this.pedidosFiltrados = pedidos;
        this.actualizarEstadoPedidosAtrasados();
        this.verificarPedidosCercanos();
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }


  //Filtra los pedidos dependiendo el estado
  filtrarPorEstado(estado: 'activo' | 'entregado' | 'atrasado'){
    this.pedidosFiltrados = this.listaPedidos.filter(pedido => pedido.estado === estado);
  }


  //Filtra los pedidos por la fecha en la que se creo
  filtrarPorFechaEntrada(fechaInicio: string, fechaFin: string){
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    this.pedidosFiltrados = this.listaPedidos.filter(pedido =>{
      const fechaEntrada = new Date(pedido.fechaEntrada);
      return fechaEntrada >= inicio && fechaEntrada <= fin;
    });
  }


  //Filtra los pedidos por el cliente que tenga asociado
  filtrarPorCliente(){
    const filtro = this.clienteFiltro.toLowerCase();
    this.pedidosFiltrados = this.listaPedidos.filter(pedido =>
      pedido.cliente.nombre.toLowerCase().includes(filtro) ||
      pedido.cliente.apellido.toLowerCase().includes(filtro)
    );
  }


  //Borra los filtros
  resetearFiltros(){
    this.pedidosFiltrados = [...this.listaPedidos]; // Restaura la lista original
    this.clienteFiltro = ''; 
  }

  //Confirma, o no, y ejecuta la Request de deletePedido
  eliminarPedidos(id: Number | null | undefined){

    //Confirma que el cliente quiere eliminar el pedido
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: {
        mensaje: 'Estas seguro que quieres eliminar el pedido?',
      },
    });
    
    dialogRef.afterClosed().subscribe((confirmacion) => {
      if (confirmacion) {

        //Elimina el pedido
        this.ts.deletePedido(id).subscribe({
          next: () => {
            this.dialogoGenerico.abrirDialogo("Pedido eliminado");
            this.listarPedidos();
          },
          error: (e: Error) => {
            console.log(e.message);
          }
          
        });
      }
    });
  }


  //Verifica los pedidos que esten a pocos dias de finalizar, comparado con la fecha actual
  verificarPedidosCercanos(){
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizamos la fecha 
    
    this.pedidosCercanos = this.listaPedidos.filter(pedido => {
      let esActivoOProntoAFinalizar=false;
      if(pedido.estado !== "entregado"){

        const fechaSalidaEstimada = new Date(pedido.fechaSalidaEstimada);
        fechaSalidaEstimada.setDate(fechaSalidaEstimada.getDate() + 1);
        fechaSalidaEstimada.setHours(0, 0, 0, 0); // Normalizamos la fecha de salida estimada 

        const diferenciaDias= (fechaSalidaEstimada.getTime() - hoy.getTime()) / (1000 * 3600 * 24);

        esActivoOProntoAFinalizar=
            diferenciaDias>=0 && diferenciaDias <= this.diasParaFinalizar;
      }

        // Siempre devolvemos `true` si cumple los criterios de pronto a finalizar
        return esActivoOProntoAFinalizar;
    });

    //actualizamos automaticamente el estado a activo si cumple los criterios
    this.pedidosCercanos.forEach(pedido => {
        if (pedido.estado !== 'entregado' && pedido.estado !== 'activo') {
            pedido.estado = 'activo';
            this.ts.updatePedido(pedido.id, { ...pedido, estado: 'activo' }).subscribe({
                next: () => console.log(`Pedido ID: ${pedido.id} actualizado a 'activo'.`),
                error: (e: Error) => console.error(`Error al actualizar pedido ID: ${pedido.id}: ${e.message}`)
            });
        }
    });
     // Abrir el modal automáticamente si hay pedidos cercanos
  // if (this.pedidosCercanos.length > 0) {
  //    this.dialog.open(PedidosCercanosModalComponent, {
  //     data: { pedidos: this.pedidosCercanos },
  //      width: '500px',
  //     height: 'auto', 
  //     maxHeight: '600px' 
  //    });
  //  }
}
  

  // Método  para abrir el modal manualmente con un botón
  abrirModalPedidosCercanos() {
    this.dialog.open(PedidosCercanosModalComponent, {
      data: { pedidos: this.pedidosCercanos },
      width: '500px',
      height: 'auto', 
      maxHeight: '600px' 
    });
  }
  
  
  //Se actualiza el estado de los pedidos que haya pasado su fecha de salida estimada
  actualizarEstadoPedidosAtrasados(){
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 

    this.listaPedidos.forEach(pedido => {
        const fechaSalidaEstimada = new Date(pedido.fechaSalidaEstimada);
        fechaSalidaEstimada.setDate(fechaSalidaEstimada.getDate()+1); //agregarle un dia ya que el new Date le quita 1
        fechaSalidaEstimada.setHours(0, 0, 0, 0); 
        // console.log(fechaSalidaEstimada)

        if (fechaSalidaEstimada < hoy && pedido.estado !== 'entregado' && pedido.estado !== 'atrasado') {
            // Marcamos como atrasado si la fecha ya pasó
            pedido.estado = 'atrasado';
            this.ts.updatePedido(pedido.id, { ...pedido, estado: 'atrasado' }).subscribe({
                next: () => console.log(`Pedido ID: ${pedido.id} actualizado a 'atrasado'.`),
                error: (e: Error) => console.error(`Error al actualizar pedido ID: ${pedido.id}: ${e.message}`)
            });
        } else if (fechaSalidaEstimada >= hoy && pedido.estado !== 'entregado' && pedido.estado !== 'activo') {
            // Marcamos como activo si la fecha es hoy o futura
            pedido.estado = 'activo';
            this.ts.updatePedido(pedido.id, { ...pedido, estado: 'activo' }).subscribe({
                next: () => console.log(`Pedido ID: ${pedido.id} actualizado a 'activo'.`),
                error: (e: Error) => console.error(`Error al actualizar pedido ID: ${pedido.id}: ${e.message}`)
            });
        }
    });
   
}


//Confirma la entrega y cambia el estado
confirmarEntrega(pedido: Pedidos) {


  if(pedido.estado != 'entregado'){

    //Verifica que se entregue el pedido
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: {
        mensaje: 'Estas seguro que quieres entregar el pedido?',
      },
    });
    
    dialogRef.afterClosed().subscribe((confirmacion) => {
      if (confirmacion) {
        
        //Se entrega el pedido
        this.entregarPedido(pedido);
      }
    });

  }
  else{

    this.dialogoGenerico.abrirDialogo("El pedido ya fue anteriormente entregado");

  }
}
  

//Ejecuta la UpdateCliente request
entregarPedido(pedido: Pedidos) {
  pedido.estado = 'entregado';
  const hoy = new Date();
  //console.log(hoy);
  //hoy.setHours(0, 0, 0, 0); 
  pedido.fechaEntregaEfectiva = hoy;
  //console.log(pedido.fechaEntregaEfectiva);
  //Actualiza el estado del pedido a entregado
  this.ts.updatePedido(pedido.id,pedido).subscribe({
      next: () => {
        this.dialogoGenerico.abrirDialogo(`El pedido fue marcado como entregado en fecha: ${pedido.fechaEntregaEfectiva?.toLocaleDateString()}`);
        this.listarPedidos();
          console.log(pedido.fechaEntregaEfectiva);

      },
      error: (e: Error) => {
        console.error("Error al actualizar el pedido:", e.message);
      }
    });
 }


 //Exporta un PDF con los datos del pedido
  exportarPedidoPDF(pedido: Pedidos): void {
    const doc = new jsPDF();
  
    // Título 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const titleText = "ENTRADA DE MOTORES";
    const pageWidth = doc.internal.pageSize.width;
    const titleX = (pageWidth - doc.getTextWidth(titleText)) / 2;
    doc.text(titleText, titleX, 15); 
  
    // Fecha 
    doc.setFontSize(14);
    const fechaFormateada = (new Date(pedido.fechaEntrada)).toISOString().split("T")[0];
    doc.text("Fecha: " + fechaFormateada, pageWidth - 60, 15);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
  
    // Datos del motor
    doc.text("Block Marca: " + (pedido.marcaAuto || ""), 10, 35);
    doc.text("Nro: " + (pedido.numeroSerie || ""), 150, 30);
  
    // Datos del cliente
    doc.text("DATOS DEL CLIENTE:", 10, 45);
    doc.text("Nombre y Apellido: " + (pedido.cliente.nombre || "") + " " + (pedido.cliente.apellido || ""), 10, 55);
    doc.text("D.N.I.: " + (pedido.cliente.dni || ""), 10, 65);
    doc.text("Dirección: " + (pedido.cliente.domicilio || ""), 10, 75);
    doc.text("Número: " + (pedido.cliente.altura || ""), 10, 85);
    doc.text("Nro. Teléfono: " + (pedido.cliente.numero || ""), 10, 95);
  
    // Observaciones y Firma
    doc.text("Observaciones:", 10, 110);
    doc.line(10, 117, 200, 117);
    doc.line(10, 124, 200, 124);
    doc.line(10, 131, 200, 131); 
  
    doc.text("Firma y Aclaración:", 10, 145);
    doc.line(50, 145, 100, 145);
  
    // Trabajos a realizar
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TRABAJOS A REALIZAR:", 10, 155);
    doc.setFontSize(12);
    doc.text("X trae:", 170, 155);
    doc.setFont("helvetica", "normal");
    // Lista de trabajos 
    const trabajos = [
      "Lavado de motor",
      "Rectificar cilindros",
      "Encamisar cilindros",
      "Altura camisas",
      "Superficie block",
      "Empernar bielas",
      "Rectificar cigüeñal",
      "Ajustar bielas",
      "Ajustar bancada",
      "Alezar leva",
      "Rectificar apoyos",
      "Rectificar alzas",
      "Comprar repuestos"
    ];
  
    const xCol1 = 10;
    const xCol2 = 80;
    const yStart = 165;
    let yPosTrabajos = yStart;

    // Columna izquierda y derecha para trabajos
    trabajos.forEach((trabajo, index) => {
      const x = index < trabajos.length / 2 ? xCol1 : xCol2;
      if (index === Math.ceil(trabajos.length / 2)) yPosTrabajos = yStart; // reiniciar y
      doc.rect(x, yPosTrabajos, 4, 4);
      doc.text(trabajo, x + 6, yPosTrabajos + 3);
      yPosTrabajos += 9;
    });

    // X Trae (alineado al lado derecho)
    const xTrae = [
      "Bielas:",
      "Tornillos bielas:",
      "Tornillos bcdas.:",
      "Cigüeñal:",
      "Tapas de bcdas.:",
      "Tornillos tapa bcdas.:",
      "Leva:"
    ];

    doc.setFontSize(10);
    let yPosXTrae = yStart;
    xTrae.forEach((linea) => {
    doc.text(linea, 160, yPosXTrae);
    doc.line(195, yPosXTrae, 202, yPosXTrae); // Línea para completar a mano
    yPosXTrae += 7;
    });
    // Otros
    const yOtros = Math.max(yPosTrabajos, yPosXTrae) + 10;
    doc.setFontSize(12);
    doc.text("Otros:", 12, yOtros + 5);
    doc.line(10, yOtros + 13, 200, yOtros + 13);
    doc.line(10, yOtros + 22, 200, yOtros + 22);
    
    doc.save(`Pedido_${pedido.id}.pdf`);
  }

    // Método para abrir el modal de confirmación
    notificarCliente(pedido: Pedidos) {
      
      const numeroTelefono = pedido.cliente.numero;
      const mensaje = `Estimado/a ${pedido.cliente.nombre}, su pedido está listo para ser recogido en Rectificadora Malvinas.`;
      const enlaceWhatsApp = this.whatsappService.generarEnlace(numeroTelefono, mensaje);
  
      // Abre el modal y pasa los datos de enlace y nombre del cliente
      this.dialog.open(WhatsappModalComponent, {
        data: { enlace: enlaceWhatsApp, clienteNombre: pedido.cliente.nombre },
        width: '450px',
        height: '200px'
      });
    }
}