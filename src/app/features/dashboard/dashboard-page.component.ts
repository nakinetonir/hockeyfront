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
      <div class="home-hero">
        <div class="home-hero-glow home-hero-glow-a"></div>
        <div class="home-hero-glow home-hero-glow-b"></div>

        <div class="home-hero-content">
          <div class="badge home-badge">Selecciona una liga</div>
          <h1 class="home-title">Hockey Línea Madrid</h1>
          <p class="home-subtitle">
            Consulta equipos, jugadores, porteros y partidos por competición.
          </p>

          <div class="home-logo-strip" aria-label="Equipos destacados">
            <img src="/assets/teams/trescantos.png" alt="Tres Cantos" />
            <img src="/assets/teams/sobre8ruedas.png" alt="Sobre 8 Ruedas" />
            <img src="/assets/teams/cplm.png" alt="CPLM" />
          </div>
        </div>
      </div>

      <div class="home-section-head">
        <div>
          <span class="home-eyebrow">Competiciones</span>
          <h2>Elige una liga</h2>
        </div>
        <span class="home-count">{{ orderedLeagues.length }} ligas</span>
      </div>

      <div class="league-grid">
        <a
          class="league-card"
          *ngFor="let league of orderedLeagues; let i = index"
          [routerLink]="['/liga', league.league_key]"
          [queryParams]="{ league_name: league.league_name }"
        >
          <span class="league-card-index">{{ i + 1 | number:'2.0-0' }}</span>
          <div class="league-card-body">
            <div class="league-card-title">{{ league.league_name }}</div>
            <div class="league-card-subtitle">Ver menú de la competición</div>
          </div>
          <span class="league-card-arrow">→</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .home-league-selector {
      padding: 22px 0 56px;
    }

    .home-hero {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(56, 189, 248, 0.28);
      border-radius: 28px;
      padding: 34px;
      min-height: 280px;
      background:
        linear-gradient(135deg, rgba(8, 47, 73, 0.72), rgba(15, 23, 42, 0.94) 42%, rgba(2, 6, 23, 0.98)),
        radial-gradient(circle at 88% 18%, rgba(56, 189, 248, 0.24), transparent 28%);
      box-shadow: 0 28px 80px rgba(2, 6, 23, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    .home-hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 44%, transparent 58%),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 82px);
      opacity: 0.35;
      pointer-events: none;
    }

    .home-hero-glow {
      position: absolute;
      width: 260px;
      height: 260px;
      border-radius: 999px;
      filter: blur(18px);
      opacity: 0.38;
      pointer-events: none;
    }

    .home-hero-glow-a {
      right: -70px;
      top: -70px;
      background: rgba(56, 189, 248, 0.55);
    }

    .home-hero-glow-b {
      left: -90px;
      bottom: -110px;
      background: rgba(37, 99, 235, 0.45);
    }

    .home-hero-content {
      position: relative;
      z-index: 1;
      max-width: 780px;
    }

    .home-badge {
      margin-bottom: 18px;
      border: 1px solid rgba(56, 189, 248, 0.22);
      background: rgba(14, 165, 233, 0.16);
    }

    .home-title {
      margin: 0;
      font-size: clamp(2.25rem, 7vw, 5.7rem);
      line-height: 0.92;
      letter-spacing: -0.07em;
      font-weight: 950;
      color: #f8fafc;
      text-wrap: balance;
    }

    .home-subtitle {
      margin: 20px 0 0;
      max-width: 560px;
      color: #b6c4d8;
      font-size: 1.08rem;
      line-height: 1.6;
    }

    .home-logo-strip {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 26px;
      flex-wrap: wrap;
    }

    .home-logo-strip img {
      width: 76px;
      height: 76px;
      object-fit: contain;
      padding: 8px;
      border-radius: 22px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow: 0 14px 26px rgba(0,0,0,0.26);
      transition: transform 0.18s ease, background 0.18s ease;
    }

    .home-logo-strip img:hover {
      transform: translateY(-3px) scale(1.04);
      background: rgba(255,255,255,0.1);
    }

    .home-section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
      margin: 30px 0 16px;
    }

    .home-section-head h2 {
      margin: 4px 0 0;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      letter-spacing: -0.04em;
    }

    .home-eyebrow,
    .home-count {
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .home-count {
      color: var(--muted);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 999px;
      padding: 8px 12px;
      white-space: nowrap;
    }

    .league-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .league-card {
      min-height: 150px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 16px;
      padding: 22px;
      border-radius: 24px;
      color: inherit;
      text-decoration: none;
      background:
        linear-gradient(160deg, rgba(30, 41, 59, 0.86), rgba(15, 23, 42, 0.94)),
        radial-gradient(circle at 20% 0%, rgba(56,189,248,0.18), transparent 30%);
      border: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow: 0 18px 42px rgba(0,0,0,0.24);
      transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }

    .league-card:hover {
      transform: translateY(-5px);
      border-color: rgba(56, 189, 248, 0.62);
      box-shadow: 0 26px 62px rgba(8, 47, 73, 0.38);
      background:
        linear-gradient(160deg, rgba(15, 118, 170, 0.18), rgba(15, 23, 42, 0.95)),
        radial-gradient(circle at 20% 0%, rgba(56,189,248,0.28), transparent 34%);
    }

    .league-card-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      color: #7dd3fc;
      background: rgba(14, 165, 233, 0.14);
      border: 1px solid rgba(56, 189, 248, 0.22);
      font-weight: 900;
      font-size: 0.82rem;
    }

    .league-card-title {
      font-size: clamp(1.35rem, 3vw, 1.9rem);
      line-height: 1.12;
      font-weight: 950;
      letter-spacing: -0.04em;
    }

    .league-card-subtitle {
      margin-top: 7px;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .league-card-arrow {
      color: var(--accent);
      font-size: 1.8rem;
      opacity: 0.85;
      transition: transform 0.18s ease;
    }

    .league-card:hover .league-card-arrow {
      transform: translateX(4px);
    }

    @media (max-width: 720px) {
      .home-league-selector {
        padding: 14px 0 34px;
      }

      .home-hero {
        border-radius: 22px;
        padding: 24px;
        min-height: auto;
      }

      .home-subtitle {
        font-size: 0.98rem;
      }

      .home-logo-strip img {
        width: 58px;
        height: 58px;
        border-radius: 18px;
      }

      .home-section-head {
        align-items: flex-start;
        flex-direction: column;
      }

      .league-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .league-card {
        min-height: 116px;
        border-radius: 20px;
        padding: 18px;
        gap: 12px;
      }

      .league-card-index {
        width: 36px;
        height: 36px;
        border-radius: 12px;
      }
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
