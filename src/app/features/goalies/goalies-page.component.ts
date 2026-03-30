import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { GoalieTotal } from '../../core/models/api.models';

@Component({
  selector: 'app-goalies-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section>
      <h1 class="page-title">Porteros</h1>
      <p class="page-subtitle">Acumulado por portero de goles encajados, tiros recibidos y porcentaje de paradas.</p>

      <div class="filters card">
        <div>
          <label class="small">Buscar</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nombre del portero" />
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
            <tr *ngFor="let item of goalies">
              <td>{{ item.goalie }}</td>
              <td>{{ item.team }}</td>
              <td>{{ item.matches || 0 }}</td>
              <td>{{ item.goals_allowed || 0 }}</td>
              <td>{{ item.shots || 0 }}</td>
              <td>{{ item.saves || ((item.shots || 0) - (item.goals_allowed || 0)) }}</td>
              <td>{{ item.save_pct || 0 | number:'1.0-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class GoaliesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  goalies: GoalieTotal[] = [];
  teams: string[] = [];
  search = '';
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getGoalies({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.goalies = data.items;
    });
  }
}
