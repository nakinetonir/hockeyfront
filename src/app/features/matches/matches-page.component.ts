import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
      <h1 class="page-title">Partidos</h1>
      <p class="page-subtitle">Histórico de partidos importados desde MongoDB, con búsqueda por equipo y logos en cada enfrentamiento.</p>

      <div class="filters card filters-3">
        <div>
          <label class="small">Buscar general</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Pista o fecha" />
        </div>
        <div>
          <label class="small">Buscar equipo</label>
          <input [(ngModel)]="teamSearch" (ngModelChange)="applyTeamFilter()" placeholder="Equipo local o visitante" />
        </div>
        <div>
          <label class="small">Equipo</label>
          <select [(ngModel)]="team" (ngModelChange)="load()">
            <option value="">Todos</option>
            <option *ngFor="let item of teams" [value]="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <div class="grid matches-grid" style="gap: 12px">
        <div class="card match-card" *ngFor="let item of filteredMatches" [class.team-360-card]="is360(item.home_team) || is360(item.away_team)">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap;">
            <div style="width:100%;">
              <div class="badge">{{ item.status || 'Finalizado' }}</div>
              <div class="match-header">
                <div class="match-side">
                  <app-team-logo [team]="item.home_team" size="lg" [animate360]="true"></app-team-logo>
                  <div class="match-team-meta">
                    <span class="match-team-name">{{ item.home_team }}</span>
                    <span class="match-score">{{ item.home_score ?? '-' }}</span>
                  </div>
                </div>
                <div class="match-versus">vs</div>
                <div class="match-side match-side-away">
                  <div class="match-team-meta match-team-meta-away">
                    <span class="match-team-name">{{ item.away_team }}</span>
                    <span class="match-score">{{ item.away_score ?? '-' }}</span>
                  </div>
                  <app-team-logo [team]="item.away_team" size="lg" [animate360]="true"></app-team-logo>
                </div>
              </div>
              <div class="small">{{ item.date || 'Sin fecha' }} · {{ item.venue || 'Sin pista' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class MatchesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  matches: MatchItem[] = [];
  filteredMatches: MatchItem[] = [];
  teams: string[] = [];
  search = '';
  teamSearch = '';
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getMatches({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.matches = data.items;
      this.applyTeamFilter();
    });
  }

  applyTeamFilter(): void {
    this.filteredMatches = filterByTeamText(
      this.matches,
      (item) => `${item.home_team || ''} ${item.away_team || ''}`,
      this.teamSearch
    );
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
