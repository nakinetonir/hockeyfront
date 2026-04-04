import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { DashboardSummary } from '../../core/models/api.models';
import { isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, TeamLogoComponent],
  template: `
    <section>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Resumen general de partidos, goleadores, porteros y equipos.</p>

      <div class="grid grid-4" *ngIf="summary as data">
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
          <div class="kpi-value">{{ data.topScorers[0]?.goals || 0 }}</div>
          <div class="kpi-label">Máximo goleador</div>
        </div>
      </div>

      <div class="grid grid-3" style="margin-top: 20px" *ngIf="summary as data">
        <div class="card">
          <div class="badge">Top goles</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Jugador</th><th>Equipo</th><th>G</th><th>A</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of data.topScorers" [class.team-360-row]="is360(item.team)">
                  <td>{{ item.player }}</td>
                  <td><div class="team-cell team-cell-logo-only"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo></div></td>
                  <td>{{ item.goals || 0 }}</td>
                  <td>{{ item.assists || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="badge">Top asistencias</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Jugador</th><th>Equipo</th><th>A</th><th>Pts</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of data.topAssisters" [class.team-360-row]="is360(item.team)">
                  <td>{{ item.player }}</td>
                  <td><div class="team-cell team-cell-logo-only"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo></div></td>
                  <td>{{ item.assists || 0 }}</td>
                  <td>{{ item.points || ((item.goals || 0) + (item.assists || 0)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="badge">Top porteros</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Portero</th><th>Equipo</th><th>SV%</th><th>Tiros</th></tr></thead>
              <tbody>
                <tr *ngFor="let item of data.topGoalies" [class.team-360-row]="is360(item.team)">
                  <td>{{ item.goalie }}</td>
                  <td><div class="team-cell team-cell-logo-only"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo></div></td>
                  <td>{{ item.save_pct || 0 | number:'1.0-2' }}</td>
                  <td>{{ item.shots || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px" *ngIf="summary?.topTeams?.length">
        <div class="badge">Top equipos</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Equipo</th><th>GF</th><th>GC</th><th>TF</th><th>TC</th></tr></thead>
            <tbody>
              <tr *ngFor="let item of summary?.topTeams" [class.team-360-row]="is360(item.team)">
                <td><div class="team-cell team-cell-with-name"><app-team-logo [team]="item.team" [animate360]="true"></app-team-logo><span>{{ item.team }}</span></div></td>
                <td>{{ item.goals_for || 0 }}</td>
                <td>{{ item.goals_against || 0 }}</td>
                <td>{{ item.shots_for || 0 }}</td>
                <td>{{ item.shots_against || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  summary?: DashboardSummary;

  ngOnInit(): void {
    this.api.getDashboardSummary().subscribe((data) => (this.summary = data));
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
