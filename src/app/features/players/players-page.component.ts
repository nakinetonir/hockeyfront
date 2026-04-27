import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PlayerAnalysisResponse, PlayerTotal } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { getTeamBrand, isTeam360 } from '../../core/utils/team-branding';
import { PlayerAnalysisModalComponent } from '../../shared/components/player-analysis-modal/player-analysis-modal.component';
import { AnalysisLoadingOverlayComponent } from '../../shared/components/analysis-loading-overlay/analysis-loading-overlay.component';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent, PlayerAnalysisModalComponent, AnalysisLoadingOverlayComponent],
  template: `
    <section>
      <div class="selected-league-header card" *ngIf="leagueName">
        <span>Liga seleccionada</span>
        <strong>{{ leagueName }}</strong>
      </div>

      <h1 class="page-title">Jugadores</h1>
      <p class="page-subtitle">Acumulado por jugador de goles, asistencias y puntos. Haz clic en un jugador para ver su análisis personalizado.</p>

      <div class="filters card filters-2">
        <div class="option-group">
          <label class="small">Buscar jugador</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nombre del jugador" />
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

      <div class="desktop-player-grid" aria-label="Listado de jugadores en tarjetas">
        <button
          type="button"
          *ngFor="let item of players"
          class="person-card"
          [class.team-360-card]="is360(item.team)"
          [style.--team-logo-url]="getTeamLogoCss(item.team)"
          (click)="openAnalysis(item)"
        >
          <div class="person-card-bg"></div>
          <div class="person-card-content">
            <div class="person-card-header">
              <div>
                <span class="person-card-kicker">Jugador</span>
                <h3>{{ item.player }}</h3>
              </div>
              <app-team-logo [team]="item.team" [animate360]="true"></app-team-logo>
            </div>
            <div class="person-card-stats">
              <span><small>Partidos</small><strong>{{ item.matches || 0 }}</strong></span>
              <span><small>Goles</small><strong>{{ item.goals || 0 }}</strong></span>
              <span><small>Asist.</small><strong>{{ item.assists || 0 }}</strong></span>
              <span><small>Puntos</small><strong>{{ item.points || ((item.goals || 0) + (item.assists || 0)) }}</strong></span>
            </div>
          </div>
        </button>
      </div>

      <div class="card table-wrap responsive-table-card mobile-player-table">
        <table class="stats-table clickable-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Equipo</th>
              <th>Partidos</th>
              <th>Goles</th>
              <th>Asistencias</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of players"
              [class.team-360-row]="is360(item.team)"
              [style.--team-logo-url]="getTeamLogoCss(item.team)"
              class="clickable-row team-watermark-row"
              (click)="openAnalysis(item)"
            >
              <td [attr.data-label]="'Jugador'" class="primary-cell">{{ item.player }}</td>
              <td [attr.data-label]="'Equipo'" class="team-data-cell">
                <div class="team-cell team-cell-logo-only">
                  <app-team-logo [team]="item.team" [animate360]="true"></app-team-logo>
                </div>
              </td>
              <td [attr.data-label]="'Partidos'">{{ item.matches || 0 }}</td>
              <td [attr.data-label]="'Goles'">{{ item.goals || 0 }}</td>
              <td [attr.data-label]="'Asistencias'">{{ item.assists || 0 }}</td>
              <td [attr.data-label]="'Puntos'">{{ item.points || ((item.goals || 0) + (item.assists || 0)) }}</td>
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
        linear-gradient(145deg, rgba(15, 23, 42, 0.86), rgba(17, 24, 39, 0.64)),
        var(--team-logo-url) right -24px top 8px / 190px auto no-repeat;
      box-shadow: 0 18px 48px rgba(2, 6, 23, 0.28), inset 0 1px 0 rgba(255,255,255,.05);
      transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
    }

    .person-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.07) 44%, transparent 58%),
        var(--team-logo-url) right -28px top 8px / 215px auto no-repeat;
      opacity: .36;
      pointer-events: none;
    }

    .person-card:hover {
      transform: translateY(-5px);
      border-color: rgba(125, 211, 252, 0.48);
      box-shadow: 0 24px 64px rgba(2, 6, 23, 0.38), 0 0 28px rgba(56,189,248,.10);
    }

    .team-360-card {
      background:
        linear-gradient(145deg, rgba(4, 11, 24, 0.86), rgba(9, 19, 35, 0.62)),
        radial-gradient(circle at 86% 20%, rgba(56, 189, 248, .24), rgba(34,197,94,.14) 36%, transparent 66%),
        var(--team-logo-url) right -24px top 8px / 190px auto no-repeat;
    }

    .person-card-bg {
      position: absolute;
      inset: auto -38px -56px auto;
      width: 180px;
      height: 180px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
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
      color: #93c5fd;
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
      font-size: 1.25rem;
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
export class PlayersPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  players: PlayerTotal[] = [];
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
    this.api.getPlayers({ search: this.search, team: this.team, page: 1, limit: 100, league_key: this.leagueKey }).subscribe((data) => {
      this.players = data.items;
    });
  }

  openAnalysis(item: PlayerTotal): void {
    if (!item.player || !item.team) {
      return;
    }

    this.loadingTitle = `Analizando a ${item.player}`;
    this.loadingSubtitle = `Consultando el workflow para ${item.team} y preparando un resumen visual con recomendaciones y vídeos.`;
    this.loadingAnalysis = true;
    this.analysisError = '';

    this.api
      .getPlayerAnalysis({
        nombre: item.player,
        tipo: 'jugador',
        equipo: item.team
      })
      .pipe(finalize(() => (this.loadingAnalysis = false)))
      .subscribe({
        next: (response) => {
          this.selectedAnalysis = Array.isArray(response) ? (response[0] ?? null) : response;
          this.analysisModalOpen = !!this.selectedAnalysis;
          if (!this.selectedAnalysis) {
            this.analysisError = 'No se recibió información para este jugador.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.analysisError = error.error?.message || 'No se pudo cargar el análisis del jugador.';
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
