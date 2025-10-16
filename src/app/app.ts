import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

interface StatCard {
  value: string | number;
  label: string;
}

interface FilterItem {
  label: string;
  count: number;
  active?: boolean;
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
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ReviewMaster AI');
  protected readonly drawerOpened = signal(false);

  protected readonly stats = signal<StatCard[]>([
    { value: 147, label: 'Total Reviews' },
    { value: 4.2, label: 'Avg Rating' },
    { value: '89%', label: 'Response Rate' },
    { value: 12, label: 'New Reviews' },
  ]);

  protected readonly filters = signal<FilterItem[]>([
    { label: 'All Reviews', count: 5, active: true },
    { label: 'New Reviews', count: 2, active: false },
    { label: 'Needs Response', count: 0, active: false },
    { label: 'Responded', count: 5, active: false },
  ]);

  protected toggleDrawer(): void {
    this.drawerOpened.update((opened) => !opened);
  }

  protected selectFilter(index: number): void {
    this.filters.update((filters) =>
      filters.map((filter, i) => ({
        ...filter,
        active: i === index,
      }))
    );
  }
}
