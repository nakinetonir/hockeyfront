import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LeagueItem } from '../../core/models/api.models';

type HomeLeague = LeagueItem & {
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  logos: string[];
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  private readonly teamLogoPool = [
    '/assets/teams/360.png',
    '/assets/teams/cplm.png',
    '/assets/teams/lasrozas.png',
    '/assets/teams/lobos.png',
    '/assets/teams/madridpatina.png',
    '/assets/teams/mamuts.png',
    '/assets/teams/pinguinos.png',
    '/assets/teams/renos.png',
    '/assets/teams/rolleybeers.png',
    '/assets/teams/sobre8ruedas.png',
    '/assets/teams/tirso.png',
    '/assets/teams/trescantos.png',
    '/assets/teams/vikings.png',
    '/assets/teams/pumas.png',
    '/assets/teams/bisontes.png'
  ];

  private readonly leagueLogoGroups = [
    ['/assets/teams/cplm.png', '/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png'],
    ['/assets/teams/360.png', '/assets/teams/lasrozas.png', '/assets/teams/lobos.png'],
    ['/assets/teams/madridpatina.png', '/assets/teams/mamuts.png', '/assets/teams/pinguinos.png'],
    ['/assets/teams/renos.png', '/assets/teams/rolleybeers.png', '/assets/teams/tirso.png'],
    ['/assets/teams/vikings.png', '/assets/teams/cplm.png', '/assets/teams/360.png'],
    ['/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png', '/assets/teams/lasrozas.png'],
    ['/assets/teams/pumas.png', '/assets/teams/bisontes.png', '/assets/teams/vikings.png']
  ];

  private readonly leagueOrder = [
    'Liga Senior Femenina',
    'Liga Senior 1',
    'Liga Senior 2',
    'Liga Senior 3 Grupo 1',
    'Liga Senior 3 Grupo 2',
    'Liga Senior 3 Grupo 3'
  ];

  private readonly descriptions: Record<string, string> = {
    'Liga Senior Femenina': 'Competición femenina senior con seguimiento completo de partidos y estadísticas.',
    'Liga Senior 1': 'Máximo nivel senior con equipos, jugadores, porteros y métricas de rendimiento.',
    'Liga Senior 2': 'Liga senior con calendario, resultados y datos detallados por partido.',
    'Liga Senior 3 Grupo 1': 'Grupo 1 de Senior 3 con clasificación y estadísticas filtradas.',
    'Liga Senior 3 Grupo 2': 'Grupo 2 de Senior 3 con navegación directa al panel de la competición.',
    'Liga Senior 3 Grupo 3': 'Grupo 3 de Senior 3 con datos consolidados por equipos y jugadores.'
  };

  private readonly accents = ['#38bdf8', '#22c55e', '#f97316', '#a78bfa', '#f43f5e', '#eab308'];

  leagues: HomeLeague[] = this.buildFallbackLeagues();

  ngOnInit(): void {
    this.api.getLeagues().subscribe({
      next: (data) => {
        if (!data.items?.length) {
          return;
        }

        const byName = new Map(data.items.map((item) => [item.league_name, item]));
        this.leagues = this.leagueOrder.map((name, index) => this.decorateLeague(byName.get(name) || {
          league_name: name,
          league_key: this.slugify(name)
        }, index));
      }
    });
  }

  private buildFallbackLeagues(): HomeLeague[] {
    return this.leagueOrder.map((leagueName, index) => this.decorateLeague({
      league_name: leagueName,
      league_key: this.slugify(leagueName)
    }, index));
  }

  private decorateLeague(league: LeagueItem, index: number): HomeLeague {
    return {
      ...league,
      label: league.league_name,
      shortLabel: this.shortLabel(league.league_name),
      description: this.descriptions[league.league_name] || 'Accede al panel filtrado de esta competición.',
      accent: this.accents[index % this.accents.length],
      logos: this.leagueLogoGroups[index % this.leagueLogoGroups.length] || this.pickLogos(index)
    };
  }

  private pickLogos(index: number): string[] {
    return [0, 1, 2].map((offset) => this.teamLogoPool[(index * 3 + offset) % this.teamLogoPool.length]);
  }

  private shortLabel(value: string): string {
    return value
      .replace('Liga ', '')
      .replace('Senior ', 'S')
      .replace('Grupo ', 'G');
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
