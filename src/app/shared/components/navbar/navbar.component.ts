import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="nav-shell" *ngIf="showNav">
      <div class="nav-inner">
        <a class="nav-brand" routerLink="/">
          <span class="brand-mark">HLM</span>
          <span class="brand-copy">
            <strong>Hockey Línea</strong>
            <small>Madrid</small>
          </span>
        </a>


        <button class="mobile-toggle" type="button" (click)="mobileOpen = !mobileOpen" [attr.aria-expanded]="mobileOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="nav-links" [class.nav-links-open]="mobileOpen">
          <a routerLink="/equipos" [queryParams]="leagueQueryParams" routerLinkActive="active" (click)="mobileOpen = false">
            <span class="nav-icon">🛡️</span>
            Equipos
          </a>
          <a routerLink="/jugadores" [queryParams]="leagueQueryParams" routerLinkActive="active" (click)="mobileOpen = false">
            <span class="nav-icon">⚡</span>
            Jugadores
          </a>
          <a routerLink="/porteros" [queryParams]="leagueQueryParams" routerLinkActive="active" (click)="mobileOpen = false">
            <span class="nav-icon">🥅</span>
            Porteros
          </a>
          <a routerLink="/partidos" [queryParams]="leagueQueryParams" routerLinkActive="active" (click)="mobileOpen = false">
            <span class="nav-icon">🏒</span>
            Partidos
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .nav-shell {
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(125, 211, 252, 0.18);
      background:
        linear-gradient(90deg, rgba(2, 6, 23, 0.92), rgba(8, 18, 34, 0.90)),
        radial-gradient(circle at 18% 0%, rgba(56,189,248,0.16), transparent 30%);
      backdrop-filter: blur(18px);
      box-shadow: 0 18px 48px rgba(2, 6, 23, 0.28);
    }

    .nav-inner {
      position: relative;
      display: flex;
      align-items: center;
      gap: 18px;
      min-height: 74px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 24px;
    }

    .nav-brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-width: max-content;
      text-decoration: none;
      color: #f8fafc;
    }

    .brand-mark {
      display: inline-grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 15px;
      color: #031525;
      font-size: .72rem;
      font-weight: 1000;
      letter-spacing: .08em;
      background: linear-gradient(135deg, #7dd3fc, #22c55e);
      box-shadow: 0 14px 34px rgba(14,165,233,.28);
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .brand-copy strong {
      color: #e0f2fe;
      font-size: 1.02rem;
      letter-spacing: -0.03em;
    }

    .brand-copy small {
      margin-top: 4px;
      color: #38bdf8;
      font-size: .78rem;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .nav-league-pill {
      display: flex;
      flex-direction: column;
      gap: 3px;
      max-width: 260px;
      padding: 9px 14px;
      border-radius: 18px;
      border: 1px solid rgba(125,211,252,.30);
      background:
        linear-gradient(135deg, rgba(14,165,233,.14), rgba(15,23,42,.55)),
        radial-gradient(circle at 90% 0%, rgba(34,197,94,.22), transparent 40%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
    }

    .nav-league-pill span {
      color: #93c5fd;
      font-size: .62rem;
      font-weight: 1000;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    .nav-league-pill strong {
      color: #f8fafc;
      font-size: .92rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      padding: 6px;
      border-radius: 999px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(148,163,184,.13);
    }

    .nav-links a {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 42px;
      padding: 0 14px;
      border-radius: 999px;
      color: #aebbd0;
      text-decoration: none;
      font-size: .91rem;
      font-weight: 850;
      transition: color .18s ease, background .18s ease, transform .18s ease, box-shadow .18s ease;
    }

    .nav-links a:hover {
      color: #f8fafc;
      background: rgba(125,211,252,.10);
      transform: translateY(-1px);
    }

    .nav-links a.active {
      color: #031525;
      background: linear-gradient(135deg, #7dd3fc, #38bdf8);
      box-shadow: 0 12px 30px rgba(14,165,233,.26);
    }

    .nav-icon {
      display: inline-grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
      font-size: .88rem;
    }

    .nav-links a.active .nav-icon {
      background: rgba(3,21,37,.12);
    }

    .mobile-toggle {
      display: none;
      margin-left: auto;
      width: 46px;
      height: 42px;
      border: 1px solid rgba(125,211,252,.24);
      border-radius: 14px;
      background: rgba(15,23,42,.78);
      color: #fff;
      cursor: pointer;
    }

    .mobile-toggle span {
      display: block;
      width: 20px;
      height: 2px;
      margin: 4px auto;
      border-radius: 999px;
      background: #dbeafe;
    }

    @media (max-width: 860px) {
      .nav-inner {
        min-height: 68px;
        padding: 10px 16px;
        flex-wrap: wrap;
      }

      .nav-league-pill {
        order: 3;
        width: 100%;
        max-width: none;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .mobile-toggle {
        display: block;
      }

      .nav-links {
        display: none;
        order: 4;
        width: 100%;
        margin-left: 0;
        border-radius: 22px;
        padding: 8px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .nav-links.nav-links-open {
        display: grid;
      }

      .nav-links a {
        justify-content: center;
        min-height: 48px;
        border-radius: 16px;
        background: rgba(255,255,255,.045);
      }
    }

    @media (max-width: 520px) {
      .brand-copy strong {
        font-size: .92rem;
      }

      .brand-mark {
        width: 38px;
        height: 38px;
        border-radius: 13px;
      }

      .nav-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);

  showNav = false;
  leagueKey = '';
  leagueName = '';
  leagueQueryParams: Record<string, string> = {};
  mobileOpen = false;

  ngOnInit(): void {
    this.updateFromUrl(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateFromUrl(event.urlAfterRedirects));
  }

  private updateFromUrl(url: string): void {
    const tree = this.router.parseUrl(url);
    const primary = tree.root.children['primary'];
    const path = primary?.segments.map((segment) => segment.path).join('/') || '';

    this.leagueKey = String(tree.queryParams['league_key'] || '');
    this.leagueName = String(tree.queryParams['league_name'] || '');

    if (path.startsWith('liga/')) {
      this.leagueKey = path.split('/')[1] || this.leagueKey;
      this.leagueName = this.leagueName || this.humanizeLeagueKey(this.leagueKey);
    }

    this.leagueQueryParams = this.leagueKey
      ? { league_key: this.leagueKey, league_name: this.leagueName }
      : {};

    this.mobileOpen = false;
    this.showNav = path !== '' && !!this.leagueKey;
  }

  private humanizeLeagueKey(key: string): string {
    return key
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
