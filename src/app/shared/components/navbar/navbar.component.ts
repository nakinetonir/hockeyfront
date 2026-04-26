import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="nav" *ngIf="showNav">
      <div class="nav-inner">
        <a class="nav-brand" routerLink="/">Hockey Línea Stats</a>

        <div class="nav-league-pill" *ngIf="leagueName">
          <span>Liga seleccionada</span>
          <strong>{{ leagueName }}</strong>
        </div>

        <nav class="nav-links">
          <a routerLink="/equipos" [queryParams]="leagueQueryParams" routerLinkActive="active">Equipos</a>
          <a routerLink="/jugadores" [queryParams]="leagueQueryParams" routerLinkActive="active">Jugadores</a>
          <a routerLink="/porteros" [queryParams]="leagueQueryParams" routerLinkActive="active">Porteros</a>
          <a routerLink="/partidos" [queryParams]="leagueQueryParams" routerLinkActive="active">Partidos</a>
          <a routerLink="/" [queryParams]="{}" [replaceUrl]="true">Cambiar liga</a>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);

  showNav = false;
  leagueKey = '';
  leagueName = '';
  leagueQueryParams: Record<string, string> = {};

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

    // Home is only the league selector. No menu or selected league there.
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
