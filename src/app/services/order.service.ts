import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

export interface ItemPedido {
  idProduto: number;
  quantidadeProduto: number;
  precoProduto: number;
}

export interface Pedido {
  clienteId: number;
  formaDePagamento: string; // "DEBITO", "CREDITO", etc.
  itens: ItemPedido[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8090/pedidos';

  constructor(private http: HttpClient) {}

  placeOrder(pedido: Pedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/criar`, pedido);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exibir`).pipe(
      map(pedidos => pedidos.map(p => ({
        ...p,
        status: p.status_do_pedido // Map status_do_pedido to status
      })))
    );
  }
}

