import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PlayerTotal } from '../../core/models/api.models';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section>
      <h1 class="page-title">Jugadores</h1>
      <p class="page-subtitle">Acumulado por jugador de goles, asistencias y puntos.</p>

      <div class="filters card">
        <div>
          <label class="small">Buscar</label>
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

      <div class="card table-wrap">
        <table>
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
            <tr *ngFor="let item of players">
              <td>{{ item.player }}</td>
              <td>{{ item.team }}</td>
              <td>{{ item.matches || 0 }}</td>
              <td>{{ item.goals || 0 }}</td>
              <td>{{ item.assists || 0 }}</td>
              <td>{{ item.points || ((item.goals || 0) + (item.assists || 0)) }}</td>
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
  teams: string[] = [];
  search = '';
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getPlayers({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.players = data.items;
    });
  }
}
