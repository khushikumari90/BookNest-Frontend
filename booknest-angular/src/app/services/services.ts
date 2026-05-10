import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, CartItem, Order, PlaceOrderRequest, Address, Wallet, Statement, Review, Notification, Wishlist } from '../models/models';

// ── Cart Service ──────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly BASE = '/api/cart';
  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<Cart> { return this.http.get<Cart>(`${this.BASE}/${userId}`); }
  addItem(userId: number, item: { bookId: number; bookTitle: string; price: number; quantity: number }): Observable<Cart> {
    return this.http.post<Cart>(`${this.BASE}/${userId}/add`, item);
  }
  updateItem(userId: number, itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.BASE}/${userId}/update/${itemId}`, { quantity });
  }
  removeItem(userId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${userId}/remove/${itemId}`);
  }
  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${userId}/clear`);
  }
}

// ── Order Service ─────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly BASE = '/api/orders';
  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<Order[]> { return this.http.get<Order[]>(`${this.BASE}/user/${userId}`); }
  getAll(): Observable<Order[]> { return this.http.get<Order[]>(`${this.BASE}/all`); }
  placeCOD(req: PlaceOrderRequest): Observable<Order> { return this.http.post<Order>(`${this.BASE}/place`, req); }
  placeOnline(req: PlaceOrderRequest): Observable<Order> { return this.http.post<Order>(`${this.BASE}/online`, req); }
  changeStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.BASE}/${orderId}/status`, { status });
  }
  getSavedAddresses(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.BASE}/address/customer/${userId}`);
  }
}

// ── Wallet Service ────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly BASE = '/api/wallet';
  constructor(private http: HttpClient) {}

  getWallet(userId: number): Observable<Wallet> { return this.http.get<Wallet>(`${this.BASE}/user/${userId}`); }
  createWallet(userId: number): Observable<Wallet> { return this.http.post<Wallet>(`${this.BASE}/create/${userId}`, {}); }
  addMoney(userId: number, amount: number, remarks: string): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.BASE}/user/${userId}/add-money`, { amount, remarks });
  }
  payMoney(userId: number, amount: number, remarks: string): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.BASE}/user/${userId}/pay`, { amount, remarks });
  }
  getStatements(userId: number): Observable<Statement[]> {
    return this.http.get<Statement[]>(`${this.BASE}/user/${userId}/statements`);
  }
}

// ── Review Service ────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly BASE = '/api/reviews';
  constructor(private http: HttpClient) {}

  getByBook(bookId: number): Observable<Review[]> { return this.http.get<Review[]>(`${this.BASE}/book/${bookId}`); }
  getAll(): Observable<Review[]> { return this.http.get<Review[]>(`${this.BASE}/all`); }
  getAvgRating(bookId: number): Observable<number> { return this.http.get<number>(`${this.BASE}/book/${bookId}/avg-rating`); }
  addReview(review: Partial<Review>): Observable<Review> { return this.http.post<Review>(this.BASE, review); }
  deleteReview(id: number): Observable<void> { return this.http.delete<void>(`${this.BASE}/${id}`); }
}

// ── Notification Service ──────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly BASE = '/api/notifications';
  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<Notification[]> { return this.http.get<Notification[]>(`${this.BASE}/user/${userId}`); }
  getUnreadCount(userId: number): Observable<number> { return this.http.get<number>(`${this.BASE}/user/${userId}/unread-count`); }
  markAllRead(userId: number): Observable<void> { return this.http.put<void>(`${this.BASE}/user/${userId}/read-all`, {}); }
  sendNotification(n: { userId: number; type: string; message: string }): Observable<Notification> {
    return this.http.post<Notification>(`${this.BASE}/send`, n);
  }
  deleteNotification(id: number): Observable<void> { return this.http.delete<void>(`${this.BASE}/${id}`); }
}

// ── Wishlist Service ──────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly BASE = '/api/wishlist';
  constructor(private http: HttpClient) {}

  getWishlist(userId: number): Observable<Wishlist> { return this.http.get<Wishlist>(`${this.BASE}/${userId}`); }
  addBook(userId: number, item: { bookId: number; bookTitle: string; bookPrice: number }): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.BASE}/${userId}/add`, item);
  }
  removeBook(userId: number, bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${userId}/remove/${bookId}`);
  }
  clearWishlist(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${userId}/clear`);
  }
}
