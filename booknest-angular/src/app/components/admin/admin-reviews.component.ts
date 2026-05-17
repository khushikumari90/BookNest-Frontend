import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/services';
import { Review } from '../../models/models';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="fas fa-star"></i> Moderate Reviews</h1>
        <p>{{reviews.length}} total reviews</p>
      </div>

      <div class="loading" *ngIf="loading"><div class="spinner"></div></div>

      <div class="card table-card" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Book ID</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Verified</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reviews">
              <td>{{r.reviewId}}</td>
              <td>{{r.bookId}}</td>
              <td>{{r.userId}}</td>
              <td>
                <span class="stars">
                  <span *ngFor="let s of getStars(r.rating)">★</span>
                  <span class="empty" *ngFor="let s of getEmptyStars(r.rating)">★</span>
                </span>
                {{r.rating}}/5
              </td>
              <td class="comment-cell">{{r.comment}}</td>
              <td><span class="badge" [class]="r.verified ? 'badge-success' : 'badge-secondary'">{{r.verified ? 'Verified' : 'Unverified'}}</span></td>
              <td>{{r.reviewDate | date:'shortDate'}}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(r.reviewId)">
                  <i class="fas fa-trash"></i> Remove
                </button>
              </td>
            </tr>
            <tr *ngIf="!reviews.length">
              <td colspan="8" style="text-align:center;color:var(--text-muted);padding:32px">No reviews found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table-card { padding: 0; overflow: hidden; overflow-x: auto; }
    table { margin: 0; min-width: 800px; }
    .stars { color: #f6ad55; .empty { color: #e2e8f0; } }
    .comment-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `]
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;

  constructor(private reviewSvc: ReviewService) {}

  ngOnInit() {
    this.reviewSvc.getAll().subscribe({ next: r => { this.reviews = r; this.loading = false; }, error: () => this.loading = false });
  }

  delete(id: number) {
    if (!confirm('Remove this review?')) return;
    this.reviewSvc.deleteReview(id).subscribe({ next: () => { this.reviews = this.reviews.filter(r => r.reviewId !== id); }, error: () => {} });
  }

  getStars(r: number): number[] { return Array(r).fill(0); }
  getEmptyStars(r: number): number[] { return Array(5 - r).fill(0); }
}
