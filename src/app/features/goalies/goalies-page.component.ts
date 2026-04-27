import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { GoalieTotal, PlayerAnalysisResponse } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { getTeamBrand, isTeam360 } from '../../core/utils/team-branding';
import { PlayerAnalysisModalComponent } from '../../shared/components/player-analysis-modal/player-analysis-modal.component';
import { AnalysisLoadingOverlayComponent } from '../../shared/components/analysis-loading-overlay/analysis-loading-overlay.component';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-goalies-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent, PlayerAnalysisModalComponent, AnalysisLoadingOverlayComponent],
  template: `
    <section>
      <div class="selected-league-header card" *ngIf="leagueName">
        <span>Liga seleccionada</span>
        <strong>{{ leagueName }}</strong>
      </div>

      <h1 class="page-title">Porteros</h1>
      <p class="page-subtitle">Acumulado por portero de goles encajados, tiros recibidos y porcentaje de paradas. Haz clic en un portero para ver su análisis personalizado.</p>

      <div class="filters card filters-2">
        <div class="option-group">
          <label class="small">Buscar portero</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nombre del portero" />
        </div>
        <div class="option-group">
          <label class="small">Equipo</label>
          <select [(ngModel)]="team" (ngModelChange)="load()">
            <option value="">Todos</option>
            <option *ngFor="let item of teams" [value]="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <p class="analysis-error" *ngIf="analysisError">{{ analysisError }}</p>

      <div class="desktop-player-grid" aria-label="Listado de porteros en tarjetas">
        <button
          type="button"
          *ngFor="let item of goalies"
          class="person-card"
          [class.team-360-card]="is360(item.team)"
          [style.--team-logo-url]="getTeamLogoCss(item.team)"
          (click)="openAnalysis(item)"
        >
          <div class="person-card-bg"></div>
          <div class="person-card-content">
            <div class="person-card-header">
              <div>
                <span class="person-card-kicker">Portero</span>
                <h3>{{ item.goalie }}</h3>
              </div>
              <app-team-logo [team]="item.team" [animate360]="true"></app-team-logo>
            </div>
            <div class="person-card-stats goalie-stats">
              <span><small>Partidos</small><strong>{{ item.matches || 0 }}</strong></span>
              <span><small>GC</small><strong>{{ item.goals_allowed || 0 }}</strong></span>
              <span><small>Tiros</small><strong>{{ item.shots || 0 }}</strong></span>
              <span><small>Paradas</small><strong>{{ item.saves || ((item.shots || 0) - (item.goals_allowed || 0)) }}</strong></span>
              <span><small>SV%</small><strong>{{ item.save_pct || 0 | number:'1.0-2' }}</strong></span>
            </div>
          </div>
        </button>
      </div>

      <div class="card table-wrap responsive-table-card mobile-player-table">
        <table class="stats-table clickable-table">
          <thead>
            <tr>
              <th>Portero</th>
              <th>Equipo</th>
              <th>Partidos</th>
              <th>GC</th>
              <th>Tiros</th>
              <th>Paradas</th>
              <th>SV%</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of goalies"
              [class.team-360-row]="is360(item.team)"
              [style.--team-logo-url]="getTeamLogoCss(item.team)"
              class="clickable-row team-watermark-row"
              (click)="openAnalysis(item)"
            >
              <td [attr.data-label]="'Portero'" class="primary-cell">{{ item.goalie }}</td>
              <td [attr.data-label]="'Equipo'" class="team-data-cell">
                <div class="team-cell team-cell-logo-only">
                  <app-team-logo [team]="item.team" [animate360]="true"></app-team-logo>
                </div>
              </td>
              <td [attr.data-label]="'Partidos'">{{ item.matches || 0 }}</td>
              <td [attr.data-label]="'GC'">{{ item.goals_allowed || 0 }}</td>
              <td [attr.data-label]="'Tiros'">{{ item.shots || 0 }}</td>
              <td [attr.data-label]="'Paradas'">{{ item.saves || ((item.shots || 0) - (item.goals_allowed || 0)) }}</td>
              <td [attr.data-label]="'SV%'">{{ item.save_pct || 0 | number:'1.0-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-analysis-loading-overlay
        [open]="loadingAnalysis"
        [title]="loadingTitle"
        [subtitle]="loadingSubtitle"
        [teams]="teams"
      />

      <app-player-analysis-modal
        [open]="analysisModalOpen"
        [analysis]="selectedAnalysis"
        (close)="closeModal()"
      />
    </section>
  `,
  styles: [`
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: rgba(59, 130, 246, 0.08); }

    .desktop-player-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .person-card {
      --team-logo-url: none;
      position: relative;
      min-height: 205px;
      overflow: hidden;
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 24px;
      padding: 0;
      color: inherit;
      text-align: left;
      cursor: pointer;
      background:
        linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.82)),
        var(--team-logo-url) right -18px top 18px / 150px auto no-repeat;
      box-shadow: 0 18px 48px rgba(2, 6, 23, 0.28), inset 0 1px 0 rgba(255,255,255,.05);
      transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
    }

    .person-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.07) 44%, transparent 58%),
        var(--team-logo-url) right -22px top 18px / 170px auto no-repeat;
      opacity: .18;
      pointer-events: none;
    }

    .person-card:hover {
      transform: translateY(-5px);
      border-color: rgba(125, 211, 252, 0.48);
      box-shadow: 0 24px 64px rgba(2, 6, 23, 0.38), 0 0 28px rgba(56,189,248,.10);
    }

    .team-360-card {
      background:
        linear-gradient(145deg, rgba(4, 11, 24, 0.97), rgba(9, 19, 35, 0.86)),
        radial-gradient(circle at 86% 20%, rgba(56, 189, 248, .20), rgba(34,197,94,.10) 36%, transparent 66%),
        var(--team-logo-url) right -18px top 18px / 150px auto no-repeat;
    }

    .person-card-bg {
      position: absolute;
      inset: auto -38px -56px auto;
      width: 180px;
      height: 180px;
      border-radius: 999px;
      background: rgba(167, 139, 250, 0.13);
      filter: blur(12px);
      pointer-events: none;
    }

    .person-card-content {
      position: relative;
      z-index: 1;
      display: flex;
      min-height: 205px;
      flex-direction: column;
      justify-content: space-between;
      padding: 18px;
    }

    .person-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }

    .person-card-kicker,
    .person-card-stats small {
      color: #c4b5fd;
      font-size: .68rem;
      font-weight: 950;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .person-card h3 {
      margin: 8px 0 0;
      max-width: 70%;
      color: #f8fafc;
      font-size: 1.15rem;
      line-height: 1.12;
      letter-spacing: -0.03em;
    }

    .person-card-stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-top: 24px;
    }

    .goalie-stats { grid-template-columns: repeat(5, minmax(0, 1fr)); }

    .person-card-stats span {
      display: grid;
      gap: 5px;
      padding: 10px;
      border-radius: 16px;
      background: rgba(15, 23, 42, 0.56);
      border: 1px solid rgba(148, 163, 184, 0.14);
    }

    .person-card-stats strong {
      color: #fff;
      font-size: 1.18rem;
      line-height: 1;
    }

    .mobile-player-table { display: none; }

    .analysis-error {
      margin: 16px 0;
      color: #b91c1c;
      font-weight: 600;
    }

    .option-group {
      display: flex;
      flex-direction: column;
      gap:0.5rem;
    }

    @media (max-width: 720px) {
      .desktop-player-grid { display: none; }
      .mobile-player-table { display: block; }
    }
  `]
})
export class GoaliesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  goalies: GoalieTotal[] = [];
  teams: string[] = [];
  search = '';
  team = '';
  leagueKey = '';
  leagueName = '';
  loadingAnalysis = false;
  analysisError = '';
  analysisModalOpen = false;
  selectedAnalysis: PlayerAnalysisResponse | null = null;
  loadingTitle = 'Preparando análisis personalizado';
  loadingSubtitle = 'Estamos consultando el workflow y construyendo recomendaciones con estadísticas, ejercicios y vídeos.';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.leagueKey = params.get('league_key') || '';
      this.leagueName = params.get('league_name') || '';
      this.api.getTeams(this.leagueKey ? { league_key: this.leagueKey } : {}).subscribe((data) => (this.teams = data.items));
      this.load();
    });
  }

  load(): void {
    this.api.getGoalies({ search: this.search, team: this.team, page: 1, limit: 100, league_key: this.leagueKey }).subscribe((data) => {
      this.goalies = data.items;
    });
  }

  openAnalysis(item: GoalieTotal): void {
    if (!item.goalie || !item.team) {
      return;
    }

    this.loadingTitle = `Analizando a ${item.goalie}`;
    this.loadingSubtitle = `Consultando el workflow para ${item.team} y preparando un resumen visual con recomendaciones y vídeos.`;
    this.loadingAnalysis = true;
    this.analysisError = '';

    this.api
      .getPlayerAnalysis({
        nombre: item.goalie,
        tipo: 'portero',
        equipo: item.team
      })
      .pipe(finalize(() => (this.loadingAnalysis = false)))
      .subscribe({
        next: (response) => {
          this.selectedAnalysis = Array.isArray(response) ? (response[0] ?? null) : response;
          this.analysisModalOpen = !!this.selectedAnalysis;
          if (!this.selectedAnalysis) {
            this.analysisError = 'No se recibió información para este portero.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.analysisError = error.error?.message || 'No se pudo cargar el análisis del portero.';
        }
      });
  }

  closeModal(): void {
    this.analysisModalOpen = false;
    this.selectedAnalysis = null;
  }


  getTeamLogoCss(team?: string): string | null {
    const logo = getTeamBrand(team)?.logo;
    return logo ? `url("${logo}")` : null;
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
