import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="nav-inner">
        <a class="nav-brand" routerLink="/">Hockey Línea Stats</a>
        <nav class="nav-links">
          <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="active">Dashboard</a>
          <a routerLink="/jugadores" routerLinkActive="active">Jugadores</a>
          <a routerLink="/porteros" routerLinkActive="active">Porteros</a>
          <a routerLink="/equipos" routerLinkActive="active">Equipos</a>
          <a routerLink="/partidos" routerLinkActive="active">Partidos</a>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {}
