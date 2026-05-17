import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/services';
import { Order } from '../../models/models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-clipboard-list"></i> Manage Orders</h1>
        <p>{{orders.length}} total orders</p>
      </div>

      <div class="filter-bar">
        <select [(ngModel)]="statusFilter" class="filter-select">
          <option value="">All Statuses</option>
          <option *ngFor="let s of statuses">{{s}}</option>
        </select>
        <input type="text" [(ngModel)]="search" placeholder="Search by order ID or book..." class="search-input">
      </div>

      <div class="loading" *ngIf="loading"><div class="spinner"></div></div>

      <div class="card table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Book</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of filtered">
              <td><strong>#{{o.orderId}}</strong></td>
              <td>{{o.userId}}</td>
              <td>{{o.bookTitle || 'Book #' + o.bookId}}</td>
              <td>{{o.quantity}}</td>
              <td>₹{{o.amountPaid | number:'1.2-2'}}</td>
              <td>{{o.modeOfPayment}}</td>
              <td><span class="badge" [ngClass]="statusClass(o.orderStatus)">{{o.orderStatus}}</span></td>
              <td>{{o.orderDate | date:'shortDate'}}</td>
              <td>
                <select class="status-select" (change)="changeStatus(o.orderId, $event)" [value]="o.orderStatus">
                  <option *ngFor="let s of statuses" [value]="s">{{s}}</option>
                </select>
              </td>
            </tr>
            <tr *ngIf="!filtered.length">
              <td colspan="9" style="text-align:center;color:var(--text-muted);padding:32px">No orders found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .filter-select, .search-input { padding: 10px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; &:focus { outline: none; border-color: var(--primary); } }
    .search-input { flex: 1; min-width: 200px; }
    .table-card { padding: 0; overflow: hidden; overflow-x: auto; }
    table { margin: 0; min-width: 900px; }
    .status-select { padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 13px; cursor: pointer; }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  statusFilter = '';
  search = '';
  statuses = ['PLACED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

  get filtered(): Order[] {
    return this.orders.filter(o => {
      const matchStatus = !this.statusFilter || o.orderStatus === this.statusFilter;
      const matchSearch = !this.search || String(o.orderId).includes(this.search) || (o.bookTitle || '').toLowerCase().includes(this.search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  constructor(private orderSvc: OrderService) {}

  ngOnInit() {
    this.orderSvc.getAll().subscribe({ next: o => { this.orders = [...o].reverse(); this.loading = false; }, error: () => this.loading = false });
  }

  changeStatus(orderId: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.orderSvc.changeStatus(orderId, status).subscribe({
      next: () => { const o = this.orders.find(x => x.orderId === orderId); if (o) o.orderStatus = status; },
      error: () => {}
    });
  }

  statusClass(s: string): string {
    const m: Record<string, string> = { PLACED: 'badge-info', CONFIRMED: 'badge-warning', DISPATCHED: 'badge-warning', DELIVERED: 'badge-success', CANCELLED: 'badge-error' };
    return m[s?.toUpperCase()] || 'badge-secondary';
  }
}
