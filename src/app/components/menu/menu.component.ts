import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Produto } from '../../services/product.service';
import { OrderService, ItemPedido } from '../../services/order.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  produtos: Produto[] = [];
  carrinho: ItemPedido[] = [];
  formaDePagamento: string = 'PIX';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.produtos = data;
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    const itemExistente = this.carrinho.find(i => i.idProduto === produto.id);
    if (itemExistente) {
      itemExistente.quantidadeProduto++;
    } else {
      this.carrinho.push({
        idProduto: produto.id!,
        quantidadeProduto: 1,
        precoProduto: produto.preco
      });
    }
  }

  finalizarPedido(): void {
    if (this.carrinho.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    const pedido = {
      clienteId: 1, // Mocked for now
      formaDePagamento: this.formaDePagamento,
      itens: this.carrinho
    };

    this.orderService.placeOrder(pedido).subscribe({
      next: () => {
        alert('Pedido realizado com sucesso!');
        this.carrinho = [];
      },
      error: () => alert('Erro ao realizar pedido.')
    });
  }
}
