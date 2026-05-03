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
  templateUrl: './players-page.component.html',
  styleUrl: './players-page.component.css',
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
      console.log(this.players)
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
