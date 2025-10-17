import { Component, signal, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

interface StatCard {
  value: string | number;
  label: string;
}

interface FilterItem {
  label: string;
  count: number;
  active?: boolean;
}

interface Review {
  id: number;
  author: string;
  initials: string;
  platform: string;
  rating: number;
  date: Date;
  text: string;
  status: 'responded' | 'pending';
  aiSuggestion?: string;
  response?: string;
}

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ReviewMaster AI');
  protected readonly drawerOpened = signal(false);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);

  // Track which filter is active
  protected readonly activeFilterIndex = signal(0);

  // Track edit mode for each review
  protected readonly editingReviewId = signal<number | null>(null);
  protected editedSuggestion = '';

  protected readonly allReviews = signal<Review[]>([
    {
      id: 1,
      author: 'Sarah Chen',
      initials: 'SC',
      platform: 'Google',
      rating: 5,
      date: new Date('2025-10-15'),
      text: 'Amazing service! The team went above and beyond to help us with our project. Highly recommended!',
      status: 'responded',
      aiSuggestion:
        "We really appreciate your kind words! It's feedback like yours that motivates us to keep delivering excellent service.",
      response:
        "Thank you so much for your wonderful review! We're thrilled to hear you had such a great experience.",
    },
    {
      id: 2,
      author: 'Mike Rodriguez',
      initials: 'MR',
      platform: 'Yelp',
      rating: 2,
      date: new Date('2025-10-14'),
      text: 'Service was slow and the staff seemed overwhelmed. Food was okay but nothing special. Expected better based on reviews.',
      status: 'responded',
      aiSuggestion:
        "We apologize for the issues you experienced. This doesn't reflect our usual standards and we'd appreciate the chance to make it right. Please contact us at your convenience.",
      response:
        "We sincerely apologize for your experience. We're working to improve our service. Please reach out to us directly.",
    },
    {
      id: 3,
      author: 'Emma Thompson',
      initials: 'ET',
      platform: 'Google',
      rating: 5,
      date: new Date('2025-10-13'),
      text: 'Great experience overall. Professional team and quality work. Only minor issue was communication could be better.',
      status: 'responded',
      aiSuggestion:
        "Thank you so much for your wonderful review! We're thrilled to hear you had such a great experience with our team.",
      response:
        "Thanks for the feedback! We're glad you enjoyed our service and we'll work on improving communication.",
    },
    {
      id: 4,
      author: 'James Wilson',
      initials: 'JW',
      platform: 'Google',
      rating: 4,
      date: new Date('2025-10-16'),
      text: 'Solid service and good attention to detail. Pricing was fair and the results exceeded expectations.',
      status: 'pending',
      aiSuggestion:
        "Thank you for your positive feedback! We're glad to hear that our attention to detail and fair pricing met your expectations.",
    },
    {
      id: 5,
      author: 'Lisa Park',
      initials: 'LP',
      platform: 'Yelp',
      rating: 5,
      date: new Date('2025-10-16'),
      text: 'Absolutely fantastic! From start to finish, everything was perfect. The team was responsive and professional.',
      status: 'pending',
      aiSuggestion:
        "We're so grateful for your kind words! It's wonderful to hear that you had such a positive experience from start to finish.",
    },
    {
      id: 6,
      author: 'David Kim',
      initials: 'DK',
      platform: 'Google',
      rating: 3,
      date: new Date('2025-10-15'),
      text: 'Average experience. Nothing wrong but nothing exceptional either. Got the job done.',
      status: 'pending',
      aiSuggestion:
        'Thank you for taking the time to share your feedback. We appreciate your business and would love to hear more about how we can improve.',
    },
    {
      id: 7,
      author: 'Amanda Foster',
      initials: 'AF',
      platform: 'Yelp',
      rating: 1,
      date: new Date('2025-10-12'),
      text: 'Very disappointed. Service was unprofessional and the final product was not what was promised. Would not recommend.',
      status: 'pending',
      aiSuggestion:
        'We sincerely apologize for falling short of your expectations. This is not the level of service we strive for. Please contact us so we can make this right.',
    },
    {
      id: 8,
      author: 'Robert Chang',
      initials: 'RC',
      platform: 'Google',
      rating: 5,
      date: new Date('2025-10-11'),
      text: 'Outstanding work! The attention to detail and customer service were both top-notch. Will definitely use again.',
      status: 'responded',
      aiSuggestion:
        "Thank you so much for your glowing review! We're delighted to hear about your positive experience.",
      response: 'We truly appreciate your kind words! Looking forward to working with you again.',
    },
    {
      id: 9,
      author: 'Maria Garcia',
      initials: 'MG',
      platform: 'Yelp',
      rating: 4,
      date: new Date('2025-10-16'),
      text: 'Really impressed with the quality of work. Quick turnaround and fair pricing. Would have given 5 stars but scheduling was a bit difficult.',
      status: 'pending',
      aiSuggestion:
        "We appreciate your positive feedback! We're glad you were impressed with our work quality and turnaround time. We'll work on improving our scheduling process.",
    },
    {
      id: 10,
      author: 'Kevin Brown',
      initials: 'KB',
      platform: 'Google',
      rating: 2,
      date: new Date('2025-10-14'),
      text: 'Had high expectations but was let down. The end result was acceptable but the process was frustrating.',
      status: 'pending',
      aiSuggestion:
        "We're sorry to hear about your frustrating experience. We value your feedback and would appreciate the opportunity to discuss this further.",
    },
  ]);

  // Helper method to determine if a review is "new" (within last 7 days and not responded)
  private isNewReview(review: Review): boolean {
    if (review.status === 'responded') return false;

    const now = new Date();
    const reviewDate = new Date(review.date);
    const daysDifference = Math.floor(
      (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDifference <= 7;
  }

  // Helper method to get display status for a review
  protected getReviewDisplayStatus(review: Review): 'new' | 'pending' | 'responded' {
    if (review.status === 'responded') return 'responded';
    return this.isNewReview(review) ? 'new' : 'pending';
  }

  protected readonly activeFilterLabel = computed(() => {
    const activeFilter = this.filters().find((f) => f.active);
    return activeFilter?.label || 'All Reviews';
  });

  protected readonly filteredReviews = computed(() => {
    const activeFilter = this.filters().find((f) => f.active);
    const reviews = this.allReviews();

    if (!activeFilter || activeFilter.label === 'All Reviews') {
      return reviews;
    }

    if (activeFilter.label === 'Needs Response') {
      return reviews.filter((r) => r.status === 'pending');
    }

    if (activeFilter.label === 'Responded') {
      return reviews.filter((r) => r.status === 'responded');
    }

    return reviews;
  });

  protected readonly newReviewsCount = computed(() => {
    return this.allReviews().filter((r) => this.isNewReview(r)).length;
  });

  protected readonly stats = computed<StatCard[]>(() => {
    const reviews = this.allReviews();
    const totalReviews = reviews.length;

    // Calculate average rating
    const avgRating =
      totalReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;

    // Calculate response rate
    const respondedCount = reviews.filter((r) => r.status === 'responded').length;
    const responseRate = totalReviews > 0 ? Math.round((respondedCount / totalReviews) * 100) : 0;

    // Count pending reviews (all that need response)
    const pendingCount = reviews.filter((r) => r.status === 'pending').length;

    return [
      { value: totalReviews, label: 'Total Reviews' },
      { value: Number(avgRating), label: 'Avg Rating' },
      { value: `${responseRate}%`, label: 'Response Rate' },
      { value: pendingCount, label: 'Pending' },
    ];
  });

  protected readonly filters = computed<FilterItem[]>(() => {
    const reviews = this.allReviews();
    const activeIndex = this.activeFilterIndex();

    return [
      { label: 'All Reviews', count: reviews.length, active: activeIndex === 0 },
      {
        label: 'Needs Response',
        count: reviews.filter((r) => r.status === 'pending').length,
        active: activeIndex === 1,
      },
      {
        label: 'Responded',
        count: reviews.filter((r) => r.status === 'responded').length,
        active: activeIndex === 2,
      },
    ];
  });

  protected toggleDrawer(): void {
    this.drawerOpened.update((opened) => !opened);
  }

  protected selectFilter(index: number): void {
    this.activeFilterIndex.set(index);
  }

  protected getStarArray(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }

  protected copyResponse(suggestion: string): void {
    this.clipboard.copy(suggestion);

    this.snackBar.open('AI suggestion copied to clipboard!', 'Close', { duration: 2000 });
  }

  protected markAsResponded(reviewId: number): void {
    this.allReviews.update((reviews) =>
      reviews.map((review) => {
        if (review.id === reviewId) {
          // Use edited suggestion if in edit mode, otherwise use AI suggestion or generic response
          const responseText =
            this.editingReviewId() === reviewId
              ? this.editedSuggestion
              : review.response ||
                review.aiSuggestion ||
                'Thank you for your feedback! We appreciate your business.';

          return {
            ...review,
            status: 'responded' as const,
            response: responseText,
          };
        }
        return review;
      })
    );

    // Clear edit mode if active
    if (this.editingReviewId() === reviewId) {
      this.editingReviewId.set(null);
      this.editedSuggestion = '';
    }

    this.snackBar.open('Review marked as responded!', 'Close', { duration: 2000 });
  }

  protected startEditingSuggestion(reviewId: number, currentText: string): void {
    this.editingReviewId.set(reviewId);
    this.editedSuggestion = currentText;
  }

  protected cancelEdit(): void {
    this.editingReviewId.set(null);
    this.editedSuggestion = '';
  }

  protected isEditing(reviewId: number): boolean {
    return this.editingReviewId() === reviewId;
  }
}
