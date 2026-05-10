import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-{{editMode ? 'edit' : 'plus'}}"></i> {{editMode ? 'Edit Book' : 'Add New Book'}}</h1>
        <a routerLink="/admin/books" class="btn btn-outline btn-sm">
          <i class="fas fa-arrow-left"></i> Back
        </a>
      </div>

      <div class="card form-card">
        <div class="alert alert-error" *ngIf="error">{{error}}</div>

        <form (ngSubmit)="submit()">
          <div class="grid-2">
            <div class="form-group">
              <label>Title *</label>
              <input type="text" [(ngModel)]="book.title" name="title" required>
            </div>
            <div class="form-group">
              <label>Author *</label>
              <input type="text" [(ngModel)]="book.author" name="author" required>
            </div>
            <div class="form-group">
              <label>ISBN</label>
              <input type="text" [(ngModel)]="book.isbn" name="isbn">
            </div>
            <div class="form-group">
              <label>Genre</label>
              <select [(ngModel)]="book.genre" name="genre">
                <option value="">— Select Genre —</option>
                <option *ngFor="let g of genres">{{g}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Publisher</label>
              <input type="text" [(ngModel)]="book.publisher" name="publisher">
            </div>
            <div class="form-group">
              <label>Published Date</label>
              <input type="date" [(ngModel)]="book.publishedDate" name="publishedDate">
            </div>
            <div class="form-group">
              <label>Price (₹) *</label>
              <input type="number" [(ngModel)]="book.price" name="price" required min="0" step="0.01">
            </div>
            <div class="form-group">
              <label>Stock *</label>
              <input type="number" [(ngModel)]="book.stock" name="stock" required min="0">
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Cover Image URL</label>
              <input type="url" [(ngModel)]="book.coverImageUrl" name="coverImageUrl" placeholder="https://example.com/cover.jpg">
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Description</label>
              <textarea [(ngModel)]="book.description" name="description" rows="4" placeholder="Enter book description..."></textarea>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="book.featured" name="featured">
                Mark as Featured
              </label>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/admin/books" class="btn btn-outline">Cancel</a>
            <button type="submit" class="btn btn-accent btn-lg" [disabled]="saving">
              <i class="fas fa-save"></i> {{saving ? 'Saving...' : (editMode ? 'Update Book' : 'Add Book')}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card { max-width: 900px; }
    .form-actions { display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end; }
    .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; input { width: auto; } }
  `]
})
export class BookFormComponent implements OnInit {
  book: Partial<Book> = { price: 0, stock: 0, featured: false };
  editMode = false;
  saving = false;
  error = '';
  bookId!: number;
  genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Mystery', 'Fantasy', 'Romance', 'Biography', 'Self-Help', 'Technology', 'Children', 'Poetry'];

  constructor(private bookSvc: BookService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.bookId = +id;
      this.bookSvc.getById(this.bookId).subscribe({ next: b => this.book = { ...b }, error: () => {} });
    }
  }

  submit() {
    this.saving = true; this.error = '';
    const req$ = this.editMode
      ? this.bookSvc.updateBook(this.bookId, this.book)
      : this.bookSvc.addBook(this.book);

    req$.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/admin/books']); },
      error: e => { this.saving = false; this.error = e?.error?.message || 'Failed to save book.'; }
    });
  }
}
