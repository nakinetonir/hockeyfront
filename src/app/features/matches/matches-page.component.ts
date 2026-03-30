import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MatchItem } from '../../core/models/api.models';

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section>
      <h1 class="page-title">Partidos</h1>
      <p class="page-subtitle">Histórico de partidos importados desde MongoDB.</p>

      <div class="filters card">
        <div>
          <label class="small">Buscar</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Equipo, pista o fecha" />
        </div>
        <div>
          <label class="small">Equipo</label>
          <select [(ngModel)]="team" (ngModelChange)="load()">
            <option value="">Todos</option>
            <option *ngFor="let item of teams" [value]="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <div class="grid" style="gap: 12px">
        <div class="card" *ngFor="let item of matches">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap;">
            <div>
              <div class="badge">{{ item.status || 'Finalizado' }}</div>
              <h3 style="margin:10px 0 6px;">{{ item.home_team }} {{ item.home_score ?? '-' }} - {{ item.away_score ?? '-' }} {{ item.away_team }}</h3>
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
  teams: string[] = [];
  search = '';
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getMatches({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.matches = data.items;
    });
  }
}
