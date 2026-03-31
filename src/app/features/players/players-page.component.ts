import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerTotal } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { filterByTeamText, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  template: `
    <section>
      <h1 class="page-title">Jugadores</h1>
      <p class="page-subtitle">Acumulado por jugador de goles, asistencias y puntos. Puedes buscar por jugador y por equipo.</p>

      <div class="filters card filters-3">
        <div>
          <label class="small">Buscar jugador</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nombre del jugador" />
        </div>
        <div>
          <label class="small">Buscar equipo</label>
          <input [(ngModel)]="teamSearch" (ngModelChange)="applyTeamFilter()" placeholder="Ej. 360, Vikings, Rollybears..." />
        </div>
        <div>
          <label class="small">Equipo</label>
          <select [(ngModel)]="team" (ngModelChange)="load()">
            <option value="">Todos</option>
            <option *ngFor="let item of teams" [value]="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <div class="card table-wrap responsive-table-card">
        <table class="stats-table">
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
            <tr *ngFor="let item of filteredPlayers" [class.team-360-row]="is360(item.team)">
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
    </section>
  `
})
export class PlayersPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  players: PlayerTotal[] = [];
  filteredPlayers: PlayerTotal[] = [];
  teams: string[] = [];
  search = '';
  teamSearch = '';
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getPlayers({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.players = data.items;
      this.applyTeamFilter();
    });
  }

  applyTeamFilter(): void {
    this.filteredPlayers = filterByTeamText(this.players, (item) => item.team, this.teamSearch);
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
