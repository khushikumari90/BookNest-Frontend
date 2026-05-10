import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/services';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-box"></i> My Orders</h1>
      </div>

      <div class="alert alert-success" *ngIf="placed">Order placed successfully! 🎉</div>

      <div class="loading" *ngIf="loading"><div class="spinner"></div></div>

      <div class="orders-list" *ngIf="!loading && orders.length">
        <div class="order-card card" *ngFor="let o of orders">
          <div class="order-header">
            <div>
              <span class="order-id">#{{o.orderId}}</span>
              <span class="badge" [ngClass]="statusClass(o.orderStatus)">{{o.orderStatus}}</span>
            </div>
            <span class="order-date">{{o.orderDate | date:'mediumDate'}}</span>
          </div>
          <div class="order-body">
            <div class="order-item">
              <div class="item-thumb"><i class="fas fa-book"></i></div>
              <div>
                <h3>{{o.bookTitle || 'Book #' + o.bookId}}</h3>
                <p>Qty: {{o.quantity}} &nbsp;|&nbsp; {{o.modeOfPayment}}</p>
              </div>
            </div>
            <div class="order-amount">₹{{o.amountPaid | number:'1.2-2'}}</div>
          </div>
          <div class="order-footer" *ngIf="o.address">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{o.address.flatNumber}}, {{o.address.city}}, {{o.address.state}} - {{o.address.pincode}}</span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && !orders.length">
        <i class="fas fa-box-open"></i>
        <h3>No orders yet</h3>
        <p>Browse books and place your first order</p>
        <a routerLink="/books" class="btn btn-primary" style="margin-top:16px">Shop Now</a>
      </div>
    </div>
  `,
  styles: [`
    .orders-list { display: flex; flex-direction: column; gap: 16px; padding-bottom: 48px; }
    .order-card { padding: 20px; }
    .order-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .order-id { font-weight: 700; font-size: 16px; margin-right: 10px; }
    .order-date { font-size: 13px; color: var(--text-muted); }
    .order-body { display: flex; align-items: center; justify-content: space-between; }
    .order-item { display: flex; align-items: center; gap: 14px; flex: 1; }
    .item-thumb { width: 48px; height: 48px; background: var(--bg); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 18px; }
    .order-item h3 { font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif; }
    .order-item p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
    .order-amount { font-size: 18px; font-weight: 700; color: var(--primary); }
    .order-footer { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; i { color: var(--accent); } }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  placed = false;

  constructor(private orderSvc: OrderService, private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.placed = !!this.route.snapshot.queryParams['placed'];
    const uid = this.auth.currentUser!.userId;
    this.orderSvc.getByUser(uid).subscribe({ next: o => { this.orders = o.reverse(); this.loading = false; }, error: () => this.loading = false });
  }

  statusClass(s: string): string {
    const m: Record<string, string> = { PLACED: 'badge-info', CONFIRMED: 'badge-warning', DISPATCHED: 'badge-warning', DELIVERED: 'badge-success', CANCELLED: 'badge-error' };
    return m[s?.toUpperCase()] || 'badge-secondary';
  }
}
