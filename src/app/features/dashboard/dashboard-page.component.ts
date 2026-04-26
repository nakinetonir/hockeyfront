import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { DashboardSummary, LeagueItem } from '../../core/models/api.models';
import { isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TeamLogoComponent],
  template: `
    <section>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Selecciona una liga para ver equipos, jugadores, porteros y partidos filtrados.</p>

      <div class="league-grid">
        <a class="card league-card" *ngFor="let league of leagues" [routerLink]="['/liga', league.league_key]" [queryParams]="{ league_name: league.league_name }">
          <div class="league-card-title">{{ league.league_name }}</div>
          <div class="league-card-subtitle">Ver estadísticas de la liga</div>
        </a>
      </div>

      <div class="grid grid-4" style="margin-top: 20px" *ngIf="summary as data">
        <div class="card">
          <div class="kpi-value">{{ data.totalMatches }}</div>
          <div class="kpi-label">Partidos totales</div>
        </div>
        <div class="card">
          <div class="kpi-value">{{ data.totalPlayers }}</div>
          <div class="kpi-label">Jugadores totales</div>
        </div>
        <div class="card">
          <div class="kpi-value">{{ data.totalGoalies }}</div>
          <div class="kpi-label">Porteros totales</div>
        </div>
        <div class="card">
          <div class="kpi-value">{{ leagues.length }}</div>
          <div class="kpi-label">Ligas disponibles</div>
        </div>
      </div>

      <div class="grid grid-3" style="margin-top: 20px" *ngIf="summary as data">
        <div class="card">
          <div class="badge">Top goles global</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Jugador</th><th>Equipo</th><th>Liga</th><th>G</th><th>A</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of data.topScorers" [class.team-360-row]="is360(item.team)">
                  <td>{{ item.player }}</td>
                  <td><div class="team-cell team-cell-logo-only"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo></div></td>
                  <td>{{ item.league_name || '-' }}</td>
                  <td>{{ item.goals || 0 }}</td>
                  <td>{{ item.assists || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="badge">Top asistencias global</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Jugador</th><th>Equipo</th><th>Liga</th><th>A</th><th>Pts</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of data.topAssisters" [class.team-360-row]="is360(item.team)">
                  <td>{{ item.player }}</td>
                  <td><div class="team-cell team-cell-logo-only"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo></div></td>
                  <td>{{ item.league_name || '-' }}</td>
                  <td>{{ item.assists || 0 }}</td>
                  <td>{{ item.points || ((item.goals || 0) + (item.assists || 0)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="badge">Top porteros global</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Portero</th><th>Equipo</th><th>Liga</th><th>SV%</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of data.topGoalies" [class.team-360-row]="is360(item.team)">
                  <td>{{ item.goalie }}</td>
                  <td><div class="team-cell team-cell-logo-only"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo></div></td>
                  <td>{{ item.league_name || '-' }}</td>
                  <td>{{ item.save_pct || 0 | number:'1.0-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .league-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .league-card {
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
      font-size: 1.08rem;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .league-card-subtitle {
      color: var(--muted);
      font-size: 0.9rem;
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  summary?: DashboardSummary;
  leagues: LeagueItem[] = [];

  ngOnInit(): void {
    this.api.getLeagues().subscribe((data) => (this.leagues = data.items));
    this.api.getDashboardSummary().subscribe((data) => (this.summary = data));
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
