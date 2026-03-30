import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoalieTotal } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { filterByTeamText, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-goalies-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  template: `
    <section>
      <h1 class="page-title">Porteros</h1>
      <p class="page-subtitle">Acumulado por portero de goles encajados, tiros recibidos y porcentaje de paradas. Con búsqueda por portero y por equipo.</p>

      <div class="filters card filters-3">
        <div>
          <label class="small">Buscar portero</label>
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Nombre del portero" />
        </div>
        <div>
          <label class="small">Buscar equipo</label>
          <input [(ngModel)]="teamSearch" (ngModelChange)="applyTeamFilter()" placeholder="Ej. Renos, Lobos, 360..." />
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
            <tr *ngFor="let item of filteredGoalies" [class.team-360-row]="is360(item.team)">
              <td>{{ item.goalie }}</td>
              <td>
                <div class="team-cell">
                  <app-team-logo [team]="item.team" [animate360]="true"></app-team-logo>
                </div>
              </td>
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
  filteredGoalies: GoalieTotal[] = [];
  teams: string[] = [];
  search = '';
  teamSearch = '';
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getGoalies({ search: this.search, team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.goalies = data.items;
      this.applyTeamFilter();
    });
  }

  applyTeamFilter(): void {
    this.filteredGoalies = filterByTeamText(this.goalies, (item) => item.team, this.teamSearch);
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
