import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
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
