import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PlayerAnalysisResponse, PlayerTotal } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { isTeam360 } from '../../core/utils/team-branding';
import { PlayerAnalysisModalComponent } from '../../shared/components/player-analysis-modal/player-analysis-modal.component';
import { AnalysisLoadingOverlayComponent } from '../../shared/components/analysis-loading-overlay/analysis-loading-overlay.component';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent, PlayerAnalysisModalComponent, AnalysisLoadingOverlayComponent],
  template: `
    <section>
      <h1 class="page-title">Jugadores</h1>
      <p class="page-subtitle">Acumulado por jugador de goles, asistencias y puntos. Haz clic en un jugador para ver su análisis personalizado.</p>

      <div class="filters card filters-2">
        <div>
          <label class="small">Buscar jugador</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nombre del jugador" />
        </div>
        <div>
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
              class="clickable-row"
              (click)="openAnalysis(item)"
            >
              <td [attr.data-label]="'Jugador'" class="primary-cell">{{ item.player }}</td>
              <td [attr.data-label]="'Equipo'">
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
  `]
})
export class PlayersPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  players: PlayerTotal[] = [];
  teams: string[] = [];
  search = '';
  team = '';
  loadingAnalysis = false;
  analysisError = '';
  analysisModalOpen = false;
  selectedAnalysis: PlayerAnalysisResponse | null = null;
  loadingTitle = 'Preparando análisis personalizado';
  loadingSubtitle = 'Estamos consultando el workflow y construyendo recomendaciones con estadísticas, ejercicios y vídeos.';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getPlayers({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
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

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
