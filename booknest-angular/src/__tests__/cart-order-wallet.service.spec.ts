import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService, OrderService, WalletService } from '../../../booknest_swagger/BookNest-Razorpay/frontend/booknest-angular/src/app/services/services';

// ═══════════════════════════════════════════════════════════════════
// CartService Tests
// ═══════════════════════════════════════════════════════════════════

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  const mockCart = {
    cartId: 1,
    userId: 1,
    totalPrice: 599,
    items: [{ itemId: 1, bookId: 10, bookTitle: 'Clean Code', price: 599, quantity: 1 }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [CartService] });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /api/cart/:userId', () => {
    service.getCart(1).subscribe(cart => {
      expect(cart.userId).toBe(1);
      expect(cart.items.length).toBe(1);
    });
    const req = httpMock.expectOne('/api/cart/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should POST /api/cart/:userId/add to add an item', () => {
    const item = { bookId: 10, bookTitle: 'Clean Code', price: 599, quantity: 2 };
    service.addItem(1, item).subscribe(cart => expect(cart.totalPrice).toBe(1198));
    const req = httpMock.expectOne('/api/cart/1/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush({ ...mockCart, totalPrice: 1198 });
  });

  it('should PUT /api/cart/:userId/update/:itemId to change quantity', () => {
    service.updateItem(1, 1, 3).subscribe(cart => expect(cart.items[0].quantity).toBe(3));
    const req = httpMock.expectOne('/api/cart/1/update/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ quantity: 3 });
    req.flush({ ...mockCart, items: [{ ...mockCart.items[0], quantity: 3 }] });
  });

  it('should DELETE /api/cart/:userId/remove/:itemId', () => {
    service.removeItem(1, 1).subscribe(() => expect(true).toBe(true));
    const req = httpMock.expectOne('/api/cart/1/remove/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should DELETE /api/cart/:userId/clear', () => {
    service.clearCart(1).subscribe(() => expect(true).toBe(true));
    const req = httpMock.expectOne('/api/cart/1/clear');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should return 404 when cart not found for user', () => {
    service.getCart(999).subscribe({ error: e => expect(e.status).toBe(404) });
    const req = httpMock.expectOne('/api/cart/999');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});

// ═══════════════════════════════════════════════════════════════════
// OrderService Tests
// ═══════════════════════════════════════════════════════════════════

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrder = {
    orderId: 100,
    userId: 1,
    bookId: 10,
    bookTitle: 'Clean Code',
    orderDate: '2026-05-01',
    amountPaid: 599,
    modeOfPayment: 'COD',
    orderStatus: 'PLACED',
    quantity: 1,
    address: { fullName: 'Ravi', mobileNumber: '9876543210', flatNumber: '12B', city: 'Mathura', state: 'UP', pincode: '281001' },
  };

  const placeReq = {
    userId: 1,
    bookId: 10,
    bookTitle: 'Clean Code',
    quantity: 1,
    amountPaid: 599,
    modeOfPayment: 'COD',
    address: mockOrder.address,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [OrderService] });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /api/orders/user/:userId', () => {
    service.getByUser(1).subscribe(orders => expect(orders[0].orderId).toBe(100));
    const req = httpMock.expectOne('/api/orders/user/1');
    expect(req.request.method).toBe('GET');
    req.flush([mockOrder]);
  });

  it('should GET /api/orders/all for admin', () => {
    service.getAll().subscribe(orders => expect(orders.length).toBeGreaterThan(0));
    const req = httpMock.expectOne('/api/orders/all');
    expect(req.request.method).toBe('GET');
    req.flush([mockOrder]);
  });

  it('should POST /api/orders/place for COD order', () => {
    service.placeCOD(placeReq).subscribe(order => {
      expect(order.modeOfPayment).toBe('COD');
      expect(order.orderStatus).toBe('PLACED');
    });
    const req = httpMock.expectOne('/api/orders/place');
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });

  it('should POST /api/orders/online for online payment order', () => {
    const onlineReq = { ...placeReq, modeOfPayment: 'WALLET' };
    service.placeOnline(onlineReq).subscribe(order => expect(order.modeOfPayment).toBe('WALLET'));
    const req = httpMock.expectOne('/api/orders/online');
    expect(req.request.method).toBe('POST');
    req.flush({ ...mockOrder, modeOfPayment: 'WALLET' });
  });

  it('should PUT /api/orders/:orderId/status', () => {
    service.changeStatus(100, 'DISPATCHED').subscribe(() => expect(true).toBe(true));
    const req = httpMock.expectOne('/api/orders/100/status');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'DISPATCHED' });
    req.flush(null);
  });

  it('should GET /api/orders/address/customer/:userId', () => {
    service.getSavedAddresses(1).subscribe(addrs => expect(addrs.length).toBe(1));
    const req = httpMock.expectOne('/api/orders/address/customer/1');
    expect(req.request.method).toBe('GET');
    req.flush([mockOrder.address]);
  });
});

// ═══════════════════════════════════════════════════════════════════
// WalletService Tests
// ═══════════════════════════════════════════════════════════════════

describe('WalletService', () => {
  let service: WalletService;
  let httpMock: HttpTestingController;

  const mockWallet = { walletId: 1, currentBalance: 1000, statements: [] };
  const mockStatement = {
    statementId: 1, transactionType: 'DEPOSIT', amount: 500,
    dateTime: '2026-05-01T10:00:00', transactionRemarks: 'Top-up'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [WalletService] });
    service = TestBed.inject(WalletService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /api/wallet/user/:userId', () => {
    service.getWallet(1).subscribe(w => expect(w.currentBalance).toBe(1000));
    const req = httpMock.expectOne('/api/wallet/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockWallet);
  });

  it('should POST /api/wallet/create/:userId', () => {
    service.createWallet(1).subscribe(w => expect(w.walletId).toBe(1));
    const req = httpMock.expectOne('/api/wallet/create/1');
    expect(req.request.method).toBe('POST');
    req.flush(mockWallet);
  });

  it('should POST /api/wallet/user/:userId/add-money with amount', () => {
    service.addMoney(1, 500, 'Top-up').subscribe(w => expect(w.currentBalance).toBe(1500));
    const req = httpMock.expectOne('/api/wallet/user/1/add-money');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 500, remarks: 'Top-up' });
    req.flush({ ...mockWallet, currentBalance: 1500 });
  });

  it('should POST /api/wallet/user/:userId/pay for purchase deduction', () => {
    service.payMoney(1, 599, 'Order #100').subscribe(w => expect(w.currentBalance).toBe(401));
    const req = httpMock.expectOne('/api/wallet/user/1/pay');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 599, remarks: 'Order #100' });
    req.flush({ ...mockWallet, currentBalance: 401 });
  });

  it('should GET /api/wallet/user/:userId/statements', () => {
    service.getStatements(1).subscribe(stmts => {
      expect(stmts.length).toBe(1);
      expect(stmts[0].transactionType).toBe('DEPOSIT');
    });
    const req = httpMock.expectOne('/api/wallet/user/1/statements');
    expect(req.request.method).toBe('GET');
    req.flush([mockStatement]);
  });

  it('should handle 400 when wallet balance insufficient', () => {
    service.payMoney(1, 99999, 'Big purchase').subscribe({
      error: e => expect(e.status).toBe(400),
    });
    const req = httpMock.expectOne('/api/wallet/user/1/pay');
    req.flush('Insufficient balance', { status: 400, statusText: 'Bad Request' });
  });
});
