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
        <div>
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

      <div class="card table-wrap responsive-table-card">
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
    .clickable-row {
      cursor: pointer;
    }

    .clickable-row:hover {
      background: rgba(59, 130, 246, 0.08);
    }


    .analysis-error {
      margin: 16px 0;
      color: #b91c1c;
      font-weight: 600;
    }

     .option-group {
      display: flex;
      flex-direction: column
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
