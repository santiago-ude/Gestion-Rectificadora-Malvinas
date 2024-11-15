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

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [RouterModule, DatePipe, FormsModule, CommonModule],
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']
})
export class PedidosListComponent {
  ts = inject(PedidoService);
  whatsappService = inject(WhatsappService);
  dialog = inject(MatDialog);

  listaPedidos: Pedidos[] = [];
  pedidosFiltrados: Pedidos[] = [];
  estadoSeleccionado: string = '';
  fechaInicio: string = ''; 
  fechaFin: string = ''; 
  clienteFiltro: string = '';
  diasParaFinalizar = 4; 
  pedidosCercanos: Pedidos[] = [];

  ngOnInit(){
    this.listarPedidos();
  }

  listarPedidos(){
    this.ts.getPedidos().subscribe({
      next: (pedidos: Pedidos[]) =>{
        this.listaPedidos = pedidos;
        this.pedidosFiltrados = pedidos; // Inicializa con todos los pedidos
        this.verificarPedidosCercanos(); // Verifica si hay pedidos a punto de finalizar
        this.actualizarEstadoPedidosAtrasados();
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  filtrarPorEstado(estado: 'activo' | 'entregado' | 'atrasado'){
    this.pedidosFiltrados = this.listaPedidos.filter(pedido => pedido.estado === estado);
  }

  filtrarPorFechaEntrada(fechaInicio: string, fechaFin: string){
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    this.pedidosFiltrados = this.listaPedidos.filter(pedido => {
      const fechaEntrada = new Date(pedido.fechaEntrada);
      return fechaEntrada >= inicio && fechaEntrada <= fin;
    });
  }

  filtrarPorCliente() {
    const filtro = this.clienteFiltro.toLowerCase();
    this.pedidosFiltrados = this.listaPedidos.filter(pedido =>
      pedido.cliente.nombre.toLowerCase().includes(filtro) ||
      pedido.cliente.apellido.toLowerCase().includes(filtro)
    );
  }


  resetearFiltros() {
    this.pedidosFiltrados = [...this.listaPedidos]; // Restaura la lista original
    this.clienteFiltro = ''; 
  }

  eliminarPedidos(id: string | null | undefined) {
    this.ts.deletePedido(id).subscribe({
      next: () => {
        alert("Pedido Eliminado.");
        this.listarPedidos();
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  verificarPedidosCercanos() {
    const hoy = new Date();
    this.pedidosCercanos = this.listaPedidos.filter(pedido => {
      const fechaSalidaEstimada = new Date(pedido.fechaSalidaEstimada);
      const diferenciaDias = (fechaSalidaEstimada.getTime() - hoy.getTime()) / (1000 * 3600 * 24);
      return pedido.estado !== 'entregado' && diferenciaDias > 0 && diferenciaDias <= this.diasParaFinalizar;
    });

    // Abrir el modal automáticamente si hay pedidos cercanos
    // if (this.pedidosCercanos.length > 0) {
    //   this.dialog.open(PedidosCercanosModalComponent, {
    //     data: { pedidos: this.pedidosCercanos },
    //     width: '500px',
    //     height: 'auto', 
    //     maxHeight: '600px' 
    //   });
    // }
  }

  // Método opcional para abrir el modal manualmente con un botón
  abrirModalPedidosCercanos() {
    this.dialog.open(PedidosCercanosModalComponent, {
      data: { pedidos: this.pedidosCercanos },
      width: '500px',
      height: 'auto', 
      maxHeight: '600px' 
    });
  }
  
  
  actualizarEstadoPedidosAtrasados() {
    const hoy = new Date();

    this.listaPedidos.forEach(pedido => {
      const fechaSalidaEstimada = new Date(pedido.fechaSalidaEstimada);

      // Si la fecha de salida ya pasó y el estado no es entregado, se cambia a "atrasado"
      if (fechaSalidaEstimada < hoy && pedido.estado !== 'entregado' && pedido.estado !== 'atrasado') {
        pedido.estado = 'atrasado';
        this.ts.updatePedido(pedido.id, { ...pedido, estado: 'atrasado' }).subscribe({
          next: () => console.log(`Pedido ID: ${pedido.id} actualizado a 'atrasado'.`),
          error: (e: Error) => console.log(`Error al actualizar pedido ID: ${pedido.id}: ${e.message}`)
        });
      }
    });
  }

confirmarEntrega(pedido: Pedidos) {
  const confirmar = window.confirm("¿Estás seguro de que quieres marcar este pedido como entregado?");
  if(confirmar){
      this.entregarPedido(pedido);
    }
}
  
entregarPedido(pedido: Pedidos) {
  pedido.estado = 'entregado';
  this.ts.updatePedido(pedido.id,pedido).subscribe({
      next: () => {
        alert("El pedido ha sido marcado como entregado.");
        this.listarPedidos();
      },
      error: (e: Error) => {
        console.error("Error al actualizar el pedido:", e.message);
      }
    });
 }


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
  
    // Datos del cliente, más abajo para que haya más espacio debajo del título
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
  
    let yPos = 165;
    const columnaIzquierdaX = 10;
    const columnaDerechaX = 100;
    trabajos.forEach((trabajo, index) => {
      const xPos = index < trabajos.length / 2 ? columnaIzquierdaX : columnaDerechaX;
      if (index === Math.ceil(trabajos.length / 2)) yPos = 165; // Reiniciar la posición Y para la segunda columna
      doc.rect(xPos, yPos, 4, 4); 
      doc.text(trabajo, xPos + 6, yPos + 3);
      yPos += 9; 
    });
  
    // Otros, más separación
    yPos += 15;
    doc.text("Otros:", 10, yPos);
    doc.line(10, yPos + 5, 200, yPos + 5);
    
    doc.save(`Pedido_${pedido.id}.pdf`);
  }

    // Método para abrir el modal de confirmación
    notificarCliente(pedido: Pedidos) {
      const numeroTelefono = pedido.cliente.numero;
      const mensaje = `Estimado ${pedido.cliente.nombre}, su pedido  está listo para ser recogido en Rectificadora Malvinas.`;
      const enlaceWhatsApp = this.whatsappService.generarEnlace(numeroTelefono, mensaje);
  
      // Abre el modal y pasa los datos de enlace y nombre del cliente
      this.dialog.open(WhatsappModalComponent, {
        data: { enlace: enlaceWhatsApp, clienteNombre: pedido.cliente.nombre },
        width: '450px',
        height: '200px'
      });
    }
}