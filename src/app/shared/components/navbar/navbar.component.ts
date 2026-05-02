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
        <a class="nav-brand" routerLink="/" aria-label="Volver al inicio">
          <span class="brand-mark">HLM</span>
          <span class="brand-copy">
            <strong>Hockey Línea</strong>
            <small>Madrid</small>
          </span>
        </a>

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

        <label class="theme-radio" [class.theme-radio-dark]="isDarkTheme" title="Cambiar tema">
          <input type="checkbox" [checked]="isDarkTheme" (change)="toggleTheme()" />
          <span class="theme-radio-track">
            <span class="theme-radio-thumb"></span>
            <span class="theme-radio-label light">Light</span>
            <span class="theme-radio-label dark">Dark</span>
          </span>
        </label>

        <button class="mobile-toggle" type="button" (click)="mobileOpen = !mobileOpen" [attr.aria-expanded]="mobileOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
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
      padding: 8px 12px 8px 8px;
      border-radius: 999px;
      text-decoration: none;
      color: #f8fafc;
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(125,211,252,.12);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
      transition: transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease;
    }

    .nav-brand:hover {
      transform: translateY(-1px);
      border-color: rgba(125,211,252,.36);
      background: rgba(125,211,252,.08);
      box-shadow: 0 14px 34px rgba(14,165,233,.14);
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

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 42px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      color: #0f172a;
      background: linear-gradient(135deg, #fde68a, #7dd3fc);
      font-size: .91rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 12px 30px rgba(14,165,233,.18);
    }

    .theme-toggle:hover {
      transform: translateY(-1px);
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


    .theme-radio {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
      margin-left: 4px;
      cursor: pointer;
      user-select: none;
    }

    .theme-radio input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .theme-radio-track {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      width: 126px;
      height: 46px;
      padding: 4px 9px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid rgba(14,165,233,.28);
      background: linear-gradient(135deg, rgba(255,255,255,.92), rgba(224,242,254,.72));
      box-shadow: 0 16px 36px rgba(15,23,42,.14), inset 0 1px 0 rgba(255,255,255,.76);
    }

    .theme-radio-thumb {
      position: absolute;
      left: 4px;
      top: 4px;
      width: 58px;
      height: 36px;
      border-radius: 999px;
      background: linear-gradient(135deg, #0ea5e9, #22c55e);
      box-shadow: 0 10px 26px rgba(14,165,233,.25);
      transition: transform .22s ease;
    }

    .theme-radio-dark .theme-radio-thumb {
      transform: translateX(60px);
      background: linear-gradient(135deg, #111827, #38bdf8);
    }

    .theme-radio-label {
      position: relative;
      z-index: 1;
      width: 52px;
      text-align: center;
      font-size: .72rem;
      font-weight: 1000;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: #0f172a;
      transition: color .22s ease;
    }

    .theme-radio:not(.theme-radio-dark) .theme-radio-label.light,
    .theme-radio-dark .theme-radio-label.dark {
      color: #ffffff;
    }

    @media (max-width: 860px) {
      .nav-inner {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 58px;
        min-height: 76px;
        padding: 10px 14px;
        flex-wrap: nowrap;
        justify-content: initial;
        align-items: center;
        gap: 12px;
        width: 100%;
      }

      .nav-brand {
        flex: none;
        min-width: 0;
        width: 100%;
        max-width: 310px;
        justify-self: start;
        gap: 12px;
        padding: 9px 13px 9px 9px;
        border-radius: 22px;
        background:
          linear-gradient(135deg, rgba(14,165,233,.18), rgba(34,197,94,.10)),
          rgba(255,255,255,.045);
        border-color: rgba(125,211,252,.26);
      }

      .brand-mark {
        width: 50px;
        height: 50px;
        border-radius: 18px;
        font-size: .78rem;
      }

      .brand-copy {
        min-width: 0;
      }

      .brand-copy strong {
        font-size: 1.08rem;
      }

      .brand-copy small {
        font-size: .76rem;
        letter-spacing: .15em;
      }

      .nav-league-pill {
        display: none;
      }

      .mobile-toggle {
        display: grid;
        place-items: center;
        flex: none;
        justify-self: end;
        margin-left: 0;
        width: 58px;
        height: 58px;
        border-radius: 20px;
        border-color: rgba(125,211,252,.34);
        background:
          linear-gradient(145deg, rgba(15,23,42,.95), rgba(15,23,42,.72)),
          radial-gradient(circle at 70% 10%, rgba(56,189,248,.22), transparent 45%);
        box-shadow: 0 16px 34px rgba(2,6,23,.32), inset 0 1px 0 rgba(255,255,255,.06);
      }

      .mobile-toggle span {
        width: 24px;
        height: 2px;
        margin: 3px auto;
      }

      .nav-links {
        position: absolute;
        display: none;
        left: 0;
        right: 0;
        top: calc(100% + 8px);
        width: 100%;
        margin-left: 0;
        border-radius: 24px;
        padding: 12px;
        grid-template-columns: 1fr;
        gap: 10px;
        background:
          linear-gradient(145deg, rgba(8,18,34,.98), rgba(2,6,23,.96)),
          radial-gradient(circle at 90% 0%, rgba(56,189,248,.16), transparent 40%);
        border: 1px solid rgba(125,211,252,.22);
        box-shadow: 0 24px 70px rgba(0,0,0,.48);
      }

      .nav-links.nav-links-open {
        display: grid;
      }

      .nav-links a,
      .nav-links .theme-toggle {
        justify-content: flex-start;
        min-height: 58px;
        border-radius: 18px;
        background:
          linear-gradient(135deg, rgba(255,255,255,.065), rgba(255,255,255,.03));
        border: 1px solid rgba(148,163,184,.12);
        padding: 0 16px;
        font-size: .98rem;
      }

      .nav-icon {
        width: 32px;
        height: 32px;
      }
    }

    @media (max-width: 520px) {
      .nav-shell {
        border-bottom-color: rgba(125,211,252,.14);
      }

      .nav-inner {
        grid-template-columns: minmax(0, 1fr) 54px;
        min-height: 72px;
        padding: 9px 12px;
        gap: 10px;
      }

      .nav-brand {
        max-width: calc(100vw - 88px);
        padding: 8px 11px 8px 8px;
        gap: 10px;
      }

      .brand-copy strong {
        font-size: 1rem;
      }

      .brand-mark {
        width: 46px;
        height: 46px;
        border-radius: 16px;
      }

      .mobile-toggle {
        width: 54px;
        height: 54px;
        border-radius: 18px;
      }
    }

    /* Mobile navbar hard override: brand and hamburger always share one row */
    @media (max-width: 860px) {
      .nav-inner {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: nowrap !important;
        width: 100% !important;
        max-width: none !important;
        min-height: 74px !important;
        padding: 10px 14px !important;
        gap: 10px !important;
      }

      .nav-brand {
        width: auto !important;
        max-width: calc(100vw - 92px) !important;
        flex: 0 1 auto !important;
        justify-self: auto !important;
      }

      .mobile-toggle {
        display: grid !important;
        flex: 0 0 54px !important;
        width: 54px !important;
        height: 54px !important;
        margin-left: auto !important;
        justify-self: auto !important;
      }

      .nav-links {
        top: calc(100% + 0px) !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        max-width: none !important;
        border-radius: 0 0 24px 24px !important;
      }
    }

    @media (max-width: 420px) {
      .nav-inner {
        padding: 8px 10px !important;
      }

      .nav-brand {
        gap: 8px !important;
        padding: 7px 9px 7px 7px !important;
        max-width: calc(100vw - 78px) !important;
      }

      .brand-mark {
        width: 42px !important;
        height: 42px !important;
        border-radius: 15px !important;
      }

      .brand-copy strong {
        font-size: .94rem !important;
      }

      .brand-copy small {
        font-size: .68rem !important;
        letter-spacing: .14em !important;
      }

      .mobile-toggle {
        flex-basis: 50px !important;
        width: 50px !important;
        height: 50px !important;
        border-radius: 17px !important;
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
  isDarkTheme = false;
  mobileOpen = false;

  ngOnInit(): void {
    this.loadTheme();
    this.updateFromUrl(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateFromUrl(event.urlAfterRedirects));
  }


  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
  }

  private loadTheme(): void {
    const stored = localStorage.getItem('hlm-theme');
    this.isDarkTheme = stored === 'dark';
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('theme-dark', this.isDarkTheme);
    localStorage.setItem('hlm-theme', this.isDarkTheme ? 'dark' : 'light');
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
