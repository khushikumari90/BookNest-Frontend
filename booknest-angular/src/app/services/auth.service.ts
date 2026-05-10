import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH = '/api/auth';
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadUser(): User | null {
    const s = localStorage.getItem('booknest_user');
    return s ? JSON.parse(s) : null;
  }

  get currentUser(): User | null { return this.userSubject.value; }
  get isLoggedIn(): boolean { return !!this.currentUser; }
  get isAdmin(): boolean { return this.currentUser?.role === 'ADMIN'; }
  get token(): string | null { return localStorage.getItem('booknest_token'); }

  login(req: LoginRequest): Observable<string> {
    return this.http.post(`${this.AUTH}/login`, req, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('booknest_token', token);
        this.http.get<User>(`${this.AUTH}/profile?email=${req.email}`).subscribe(user => {
          localStorage.setItem('booknest_user', JSON.stringify(user));
          this.userSubject.next(user);
          // auto-create wallet
          this.http.post(`/api/wallet/create/${user.userId}`, {}).subscribe({ error: () => {} });
        });
      })
    );
  }

  register(req: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.AUTH}/register`, req);
  }

  registerAdmin(req: RegisterRequest & { adminSecret: string }): Observable<User> {
    if (req.adminSecret !== 'booknest@admin2026') {
      throw new Error('Invalid admin secret key.');
    }
    return this.http.post<User>(`${this.AUTH}/register/admin`, req);
  }

  logout(): void {
    localStorage.removeItem('booknest_token');
    localStorage.removeItem('booknest_user');
    this.userSubject.next(null);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.AUTH}/user/${id}`);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.AUTH}/user/${id}`, data).pipe(
      tap(user => {
        localStorage.setItem('booknest_user', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.AUTH}/users/role/${role}`);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.AUTH}/user/${id}`, { responseType: 'text' });
  }

  // Called by OAuthCallbackComponent after GitHub redirect
  setCurrentUser(user: User): void {
    localStorage.setItem('booknest_user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  // Auto-create wallet after OAuth login (safe - ignored if wallet already exists)
  createWallet(userId: number): void {
    this.http.post(`/api/wallet/create/${userId}`, {}).subscribe({ error: () => {} });
  }
}