import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LeagueItem } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="home-league-selector">
      <div class="home-hero card">
        <div class="badge">Selecciona una liga</div>
        <h1 class="page-title">Hockey Línea Madrid</h1>
      </div>

      <div class="league-grid">
        <a
          class="card league-card"
          *ngFor="let league of orderedLeagues"
          [routerLink]="['/liga', league.league_key]"
          [queryParams]="{ league_name: league.league_name }"
        >
          <div>
            <div class="league-card-title">{{ league.league_name }}</div>
          </div>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .home-league-selector {
      padding-top: 18px;
    }

    .home-hero {
      margin-bottom: 20px;
      border-color: rgba(56, 189, 248, 0.24);
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 34%),
        rgba(17, 24, 39, 0.9);
    }

    .league-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .league-card {
      min-height: 128px;
      display: flex;
      align-items: center;
      justify-content: left;
      text-decoration: none;
      color: inherit;
      border: 1px solid rgba(148, 163, 184, 0.18);
      transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    }

    .league-card:hover {
      transform: translateY(-3px);
      border-color: rgba(59, 130, 246, 0.55);
      background: rgba(59, 130, 246, 0.08);
    }

    .league-card-title {
      font-size: 1.74rem;
      font-weight: 900;
    }

    .league-card-subtitle {
      color: var(--muted);
      font-size: 0.92rem;
    }

    .league-card-arrow {
      font-size: 1.6rem;
      color: var(--accent);
      opacity: 0.85;
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  private readonly leagueOrder = [
    'Liga Senior Femenina',
    'Liga Senior 1',
    'Liga Senior 2',
    'Liga Senior 3 Grupo 1',
    'Liga Senior 3 Grupo 2',
    'Liga Senior 3 Grupo 3'
  ];

  orderedLeagues: LeagueItem[] = this.leagueOrder.map((leagueName) => ({
    league_name: leagueName,
    league_key: this.slugify(leagueName)
  }));

  ngOnInit(): void {
    this.api.getLeagues().subscribe({
      next: (data) => {
        if (!data.items?.length) {
          return;
        }

        const byName = new Map(data.items.map((item) => [item.league_name, item]));
        this.orderedLeagues = this.leagueOrder.map((name) => byName.get(name) || {
          league_name: name,
          league_key: this.slugify(name)
        });
      }
    });
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
