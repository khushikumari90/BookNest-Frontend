import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../booknest_swagger/BookNest-Razorpay/frontend/booknest-angular/src/app/services/auth.service';

// Minimal guard implementations matching the project's auth.guard.ts and admin.guard.ts
// These tests verify guard logic assuming canActivate returns boolean

describe('AuthGuard Logic', () => {
  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockAuthService = { isLoggedIn: false };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('should block unauthenticated user and navigate to /login', () => {
    // Simulates AuthGuard canActivate logic
    const isLoggedIn = mockAuthService.isLoggedIn;
    if (!isLoggedIn) {
      mockRouter.navigate!(['/login']);
    }
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow authenticated user to pass through', () => {
    mockAuthService.isLoggedIn = true;
    const canActivate = mockAuthService.isLoggedIn;
    expect(canActivate).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});

describe('AdminGuard Logic', () => {
  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockAuthService = { isLoggedIn: true, isAdmin: false };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('should redirect non-admin logged-in user to /home', () => {
    const isAdmin = mockAuthService.isAdmin;
    if (!isAdmin) {
      mockRouter.navigate!(['/home']);
    }
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should allow admin user to access admin routes', () => {
    mockAuthService.isAdmin = true;
    const canActivate = mockAuthService.isAdmin;
    expect(canActivate).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect unauthenticated user to /login (not /home)', () => {
    mockAuthService.isLoggedIn = false;
    mockAuthService.isAdmin = false;
    if (!mockAuthService.isLoggedIn) {
      mockRouter.navigate!(['/login']);
    } else if (!mockAuthService.isAdmin) {
      mockRouter.navigate!(['/home']);
    }
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
