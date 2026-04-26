import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { DashboardSummary } from '../../core/models/api.models';

@Component({
  selector: 'app-league-menu-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <div class="league-header card">
        <div>
          <div class="badge">Liga seleccionada</div>
          <h1 class="page-title league-title">{{ leagueName }}</h1>
          <p class="page-subtitle">Todas las secciones se mostrarán filtradas por esta liga.</p>
        </div>
      </div>

      <div class="grid grid-4" style="margin-top: 20px" *ngIf="summary as data">
        <div class="card">
          <div class="kpi-value">{{ data.totalMatches }}</div>
          <div class="kpi-label">Partidos</div>
        </div>
        <div class="card">
          <div class="kpi-value">{{ data.totalPlayers }}</div>
          <div class="kpi-label">Jugadores</div>
        </div>
        <div class="card">
          <div class="kpi-value">{{ data.totalGoalies }}</div>
          <div class="kpi-label">Porteros</div>
        </div>
        <div class="card">
          <div class="kpi-value">{{ data.topTeams.length }}</div>
          <div class="kpi-label">Equipos destacados</div>
        </div>
      </div>

      <div class="league-menu-grid" style="margin-top: 20px">
        <a class="card league-menu-card" routerLink="/equipos" [queryParams]="queryParams">
          <strong>Equipos</strong>
          <span>Totales y medias por equipo</span>
        </a>
        <a class="card league-menu-card" routerLink="/jugadores" [queryParams]="queryParams">
          <strong>Jugadores</strong>
          <span>Goles, asistencias y puntos</span>
        </a>
        <a class="card league-menu-card" routerLink="/porteros" [queryParams]="queryParams">
          <strong>Porteros</strong>
          <span>Paradas, tiros y porcentaje</span>
        </a>
        <a class="card league-menu-card" routerLink="/partidos" [queryParams]="queryParams">
          <strong>Partidos</strong>
          <span>Calendario y resultados</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .league-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .league-title {
      margin: 8px 0 4px;
    }

    .league-menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .league-menu-card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    }

    .league-menu-card:hover {
      transform: translateY(-3px);
      border-color: rgba(59, 130, 246, 0.55);
      background: rgba(59, 130, 246, 0.08);
    }

    .league-menu-card strong {
      font-size: 1.12rem;
    }

    .league-menu-card span {
      color: var(--muted);
    }
  `]
})
export class LeagueMenuPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  leagueKey = '';
  leagueName = 'Liga';
  queryParams: Record<string, string> = {};
  summary?: DashboardSummary;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.leagueKey = params.get('leagueKey') || '';
      this.leagueName = this.route.snapshot.queryParamMap.get('league_name') || this.humanizeLeagueKey(this.leagueKey);
      this.queryParams = { league_key: this.leagueKey, league_name: this.leagueName };
      this.api.getDashboardSummary({ league_key: this.leagueKey }).subscribe((data) => (this.summary = data));
    });
  }

  private humanizeLeagueKey(key: string): string {
    return key
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
