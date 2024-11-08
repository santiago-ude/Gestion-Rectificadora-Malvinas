import { Component, inject } from '@angular/core';
import { PedidoService } from '../../service/pedidos.service';
import { Pedidos } from '../../interface/pedidos';
import jsPDF from 'jspdf';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pedidos-list.component.html',
  styleUrl: './pedidos-list.component.css'
})
export class PedidosListComponent {
  ts = inject(PedidoService);

  listaPedidos: Pedidos[] = [];

  ngOnInit(): void {
    this.listarPedidos();
  }

  listarPedidos(){
    this.ts.getPedidos().subscribe({
      next: (pedidos: Pedidos[])=>{
        this.listaPedidos = pedidos;
      },
      error: (e: Error)=>{
        console.log(e.message);
      }
    });
  }


  eliminarPedidos(id: string | null | undefined){
    this.ts.deletePedido(id).subscribe({
      next: ()=>{
        alert("Tarea Eliminada..");
        this.listarPedidos();
      },
      error: (e: Error)=>{
        console.log(e.message);
      }

    });
  }


  exportarPedidoPDF(pedido: Pedidos): void {
    const doc = new jsPDF();
    doc.text(`Pedido de Cliente: ${pedido.cliente.nombre} ${pedido.cliente.apellido}`, 10, 10);
    doc.text(`DNI: ${pedido.cliente.dni}`, 10, 20);
    doc.text(`Fecha de Entrada: ${pedido.fechaEntrada}`, 10, 30);
    doc.text(`Fecha de Salida Estimada: ${pedido.fechaSalidaEstimada}`, 10, 40);
    doc.text(`Estado: ${pedido.estado}`, 10, 50);
    doc.text(`Marca Auto: ${pedido.marcaAuto}`, 10, 60);
    doc.text(`Modelo Auto: ${pedido.modeloAuto}`, 10, 70);
    doc.text(`Número de Serie: ${pedido.numeroSerie}`, 10, 80);
    doc.text(`Descripción: ${pedido.descripcion}`, 10, 90);

    // Calcula y muestra el total del presupuesto usando precioFinal 
    if (pedido.presupuesto) {
      const totalPresupuesto = pedido.presupuesto.items.reduce((acc, item) => acc + item.precioFinal, 0);
      doc.text(`Presupuesto Total: ${totalPresupuesto}`, 10, 100);
    }

    doc.save(`pedido_${pedido.id}.pdf`);
  }


}
