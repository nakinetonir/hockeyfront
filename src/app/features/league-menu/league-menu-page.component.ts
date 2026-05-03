import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { DashboardSummary } from '../../core/models/api.models';

interface MenuCard {
  title: string;
  label: string;
  description: string;
  route: string;
  accent: string;
  icon: string;
  metric?: keyof DashboardSummary | 'teams';
}

@Component({
  selector: 'app-league-menu-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './league-menu-page.component.html',
  styleUrl: './league-menu-page.component.css',
})
export class LeagueMenuPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  private readonly allLogos = [
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
    '/assets/teams/vikings.png'
  ];

  private readonly leagueLogoGroups: string[][] = [
    ['/assets/teams/cplm.png', '/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png', '/assets/teams/vikings.png'],
    ['/assets/teams/360.png', '/assets/teams/lasrozas.png', '/assets/teams/lobos.png', '/assets/teams/madridpatina.png'],
    ['/assets/teams/madridpatina.png', '/assets/teams/mamuts.png', '/assets/teams/pinguinos.png', '/assets/teams/renos.png'],
    ['/assets/teams/renos.png', '/assets/teams/rolleybeers.png', '/assets/teams/tirso.png', '/assets/teams/360.png'],
    ['/assets/teams/vikings.png', '/assets/teams/cplm.png', '/assets/teams/lasrozas.png', '/assets/teams/lobos.png'],
    ['/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png', '/assets/teams/pinguinos.png', '/assets/teams/mamuts.png']
  ];

  private readonly cardsBase: MenuCard[] = [
    {
      title: 'Equipos',
      label: 'Rendimiento',
      description: 'Totales, medias, goles y tiros a favor y en contra por equipo.',
      route: '/equipos',
      accent: '#38bdf8',
      icon: '🛡️',
      metric: 'teams'
    },
    {
      title: 'Jugadores',
      label: 'Ataque',
      description: 'Goles, asistencias, puntos y ranking individual de la competición.',
      route: '/jugadores',
      accent: '#22c55e',
      icon: '⚡',
      metric: 'totalPlayers'
    },
    {
      title: 'Porteros',
      label: 'Portería',
      description: 'Paradas, tiros recibidos, goles encajados y porcentaje de parada.',
      route: '/porteros',
      accent: '#a78bfa',
      icon: '🥅',
      metric: 'totalGoalies'
    },
    {
      title: 'Partidos',
      label: 'Calendario',
      description: 'Resultados, enfrentamientos, sedes y detalle de cada encuentro.',
      route: '/partidos',
      accent: '#fb923c',
      icon: '🏒',
      metric: 'totalMatches'
    }
  ];

  leagueKey = '';
  leagueName = 'Liga';
  queryParams: Record<string, string> = {};
  summary?: DashboardSummary;
  selectedLogos = this.leagueLogoGroups[0];
  cards = this.cardsBase;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.leagueKey = params.get('leagueKey') || '';
      this.leagueName = this.route.snapshot.queryParamMap.get('league_name') || this.humanizeLeagueKey(this.leagueKey);
      this.queryParams = { league_key: this.leagueKey, league_name: this.leagueName };
      this.selectedLogos = this.pickLogos(this.leagueKey);
      this.api.getDashboardSummary({ league_key: this.leagueKey }).subscribe((data) => (this.summary = data));
    });
  }


  metricValue(card: MenuCard, data: DashboardSummary): number {
    switch (card.metric) {
      case 'totalMatches':
        return data.totalMatches || 0;
      case 'totalPlayers':
        return data.totalPlayers || 0;
      case 'totalGoalies':
        return data.totalGoalies || 0;
      case 'teams':
        return data.topTeams?.length || 0;
      default:
        return 0;
    }
  }

  private pickLogos(key: string): string[] {
    const index = Math.max(0, this.leagueIndex(key));
    return this.leagueLogoGroups[index] || this.allLogos.slice(0, 4);
  }

  private leagueIndex(key: string): number {
    const normalized = key.toLowerCase();
    if (normalized.includes('femenina')) return 0;
    if (normalized.endsWith('senior-1') || normalized.includes('senior-1')) return 1;
    if (normalized.endsWith('senior-2') || normalized.includes('senior-2')) return 2;
    if (normalized.includes('grupo-1')) return 3;
    if (normalized.includes('grupo-2')) return 4;
    if (normalized.includes('grupo-3')) return 5;
    return 0;
  }

  private humanizeLeagueKey(key: string): string {
    return key
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
