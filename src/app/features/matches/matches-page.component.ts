import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatchItem } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { filterByTeamText, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  template: `
    <section>
      <div class="selected-league-header card" *ngIf="leagueName">
        <span>Liga seleccionada</span>
        <strong>{{ leagueName }}</strong>
      </div>

      <h1 class="page-title">Partidos</h1>
      <p class="page-subtitle">Histórico de partidos importados desde MongoDB. Haz clic en un partido para ver la ficha completa.</p>

      <div class="filters card filters-3">
        <div>
          <label class="small">Buscar general</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Pista o fecha" />
        </div>
        <div>
          <label class="small">Buscar equipo</label>
          <input [(ngModel)]="teamSearch" (ngModelChange)="applyTeamFilter()" placeholder="Equipo local o visitante" />
        </div>
        <div> class="option-group"
          <label class="small">Equipo</label>
          <select [(ngModel)]="team" (ngModelChange)="load()">
            <option value="">Todos</option>
            <option *ngFor="let item of teams" [value]="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <div class="grid matches-grid" style="gap: 12px">
        <button
          type="button"
          class="card match-card match-card-button"
          *ngFor="let item of filteredMatches"
          [class.team-360-card]="is360(item.home_team) || is360(item.away_team)"
          (click)="openMatch(item)"
        >
          <div class="match-card-inner">
            <div class="badge">{{ item.status || 'Finalizado' }}</div>
            <div class="match-header">
              <div class="match-side match-side-stack" [attr.title]="item.home_team || 'Equipo local'">
                <app-team-logo [team]="item.home_team" size="lg" [animate360]="true"></app-team-logo>
                <span class="match-score">{{ item.home_score ?? '-' }}</span>
              </div>
              <div class="match-versus">vs</div>
              <div class="match-side match-side-stack" [attr.title]="item.away_team || 'Equipo visitante'">
                <app-team-logo [team]="item.away_team" size="lg" [animate360]="true"></app-team-logo>
                <span class="match-score">{{ item.away_score ?? '-' }}</span>
              </div>
            </div>
            <div class="match-card-teams">
              <strong>{{ item.home_team || 'Local' }}</strong>
              <span>vs</span>
              <strong>{{ item.away_team || 'Visitante' }}</strong>
            </div>
            <div class="small">{{ item.date || 'Sin fecha' }} · {{ item.venue || 'Sin pista' }}</div>
          </div>
        </button>
      </div>

      <div class="modal-backdrop" *ngIf="selectedMatch" (click)="closeMatch()">
        <div class="modal-card match-modal-card" (click)="$event.stopPropagation()">
          <button class="modal-close" type="button" (click)="closeMatch()">×</button>

          <div class="badge">{{ selectedMatch.status || 'Finalizado' }}</div>
          <h2 class="match-modal-title">{{ selectedMatch.home_team || 'Local' }} vs {{ selectedMatch.away_team || 'Visitante' }}</h2>

          <div class="match-modal-score">
            <div class="match-modal-team">
              <app-team-logo [team]="selectedMatch.home_team" size="lg" [animate360]="true"></app-team-logo>
              <strong>{{ selectedMatch.home_team || 'Local' }}</strong>
              <span>{{ selectedMatch.home_score ?? '-' }}</span>
            </div>
            <div class="match-versus">vs</div>
            <div class="match-modal-team">
              <app-team-logo [team]="selectedMatch.away_team" size="lg" [animate360]="true"></app-team-logo>
              <strong>{{ selectedMatch.away_team || 'Visitante' }}</strong>
              <span>{{ selectedMatch.away_score ?? '-' }}</span>
            </div>
          </div>

          <div class="match-detail-grid">
            <div><span>Fecha</span><strong>{{ selectedMatch.date || '-' }}</strong></div>
            <div><span>Pista</span><strong>{{ selectedMatch.venue || '-' }}</strong></div>
            <div><span>Liga</span><strong>{{ selectedMatch.league_name || leagueName || '-' }}</strong></div>
            <div><span>ID partido</span><strong>{{ selectedMatch.match_id || selectedMatch._id || '-' }}</strong></div>
            <div><span>Temporada</span><strong>{{ selectedMatch.season || '-' }}</strong></div>
            <div><span>Estado</span><strong>{{ selectedMatch.status || 'Finalizado' }}</strong></div>
          </div>

          <a *ngIf="selectedMatch.detail_url" class="match-detail-link" [href]="selectedMatch.detail_url" target="_blank" rel="noopener">
            Abrir ficha original
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .match-card-button {
      border: 1px solid var(--border);
      color: inherit;
      text-align: inherit;
      cursor: pointer;
      transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    }

    .match-card-button:hover {
      transform: translateY(-2px);
      border-color: rgba(56, 189, 248, 0.48);
      background: rgba(56, 189, 248, 0.07);
    }

    .match-card-inner {
      width: 100%;
    }

    .option-group {
      display: flex;
      flex-direction: column
    }

    .match-card-teams {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin: 8px 0 6px;
      color: var(--text);
      text-align: center;
    }

    .match-card-teams span {
      color: var(--muted);
      font-size: 0.78rem;
      text-transform: uppercase;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgba(2, 6, 23, 0.78);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }

    .modal-card {
      position: relative;
      width: min(720px, 100%);
      max-height: 90vh;
      overflow: auto;
      background: rgba(15, 23, 42, 0.98);
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 22px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
      padding: 22px;
    }

    .modal-close {
      position: absolute;
      top: 12px;
      right: 14px;
      width: 36px;
      height: 36px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.85);
      color: var(--text);
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
    }

    .match-modal-title {
      margin: 14px 42px 18px 0;
      font-size: 1.35rem;
    }

    .match-modal-score {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      margin: 18px 0 22px;
    }

    .match-modal-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
    }

    .match-modal-team span {
      font-size: 2.4rem;
      font-weight: 900;
    }

    .match-detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }

    .match-detail-grid div {
      padding: 12px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 14px;
      background: rgba(30, 41, 59, 0.52);
    }

    .match-detail-grid span {
      display: block;
      color: var(--muted);
      font-size: 0.78rem;
      margin-bottom: 6px;
    }

    .match-detail-link {
      display: inline-flex;
      margin-top: 16px;
      color: var(--accent);
      font-weight: 800;
    }

    @media (max-width: 720px) {
      .match-modal-score {
        grid-template-columns: 1fr;
      }

      .match-modal-score .match-versus {
        justify-self: center;
      }
    }
  `]
})
export class MatchesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  matches: MatchItem[] = [];
  filteredMatches: MatchItem[] = [];
  teams: string[] = [];
  search = '';
  teamSearch = '';
  team = '';
  leagueKey = '';
  leagueName = '';
  selectedMatch: MatchItem | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.leagueKey = params.get('league_key') || '';
      this.leagueName = params.get('league_name') || '';
      this.api.getTeams(this.leagueKey ? { league_key: this.leagueKey } : {}).subscribe((data) => (this.teams = data.items));
      this.load();
    });
  }

  load(): void {
    this.api.getMatches({ search: this.search, team: this.team, page: 1, limit: 100, league_key: this.leagueKey }).subscribe((data) => {
      this.matches = [...data.items].sort((a, b) => this.getMatchTimestamp(b.date) - this.getMatchTimestamp(a.date));
      this.applyTeamFilter();
    });
  }

  applyTeamFilter(): void {
    this.filteredMatches = filterByTeamText(
      this.matches,
      (item) => `${item.home_team || ''} ${item.away_team || ''}`,
      this.teamSearch
    ).sort((a, b) => this.getMatchTimestamp(b.date) - this.getMatchTimestamp(a.date));
  }

  openMatch(match: MatchItem): void {
    this.selectedMatch = match;
  }

  closeMatch(): void {
    this.selectedMatch = null;
  }

  private getMatchTimestamp(dateValue?: string | null): number {
    if (!dateValue) {
      return 0;
    }

    const normalized = dateValue.trim();
    const ddmmyyyy = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);

    if (ddmmyyyy) {
      const [, day, month, year, hour = '0', minute = '0'] = ddmmyyyy;
      return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).getTime();
    }

    const parsed = Date.parse(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
