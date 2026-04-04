import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { TeamShotTotal } from '../../core/models/api.models';
import { isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-team-shots-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  template: `
    <section>
      <h1 class="page-title">Tiros por equipo</h1>
      <p class="page-subtitle">Totales y medias de tiros a favor y en contra por equipo.</p>

      <div class="filters card filters-2">
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
              <th>Equipo</th>
              <th>Partidos</th>
              <th>Tiros a favor</th>
              <th>Tiros en contra</th>
              <th>Media a favor</th>
              <th>Media en contra</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items" [class.team-360-row]="is360(item.team)">
              <td [attr.data-label]="'Equipo'">
                <div class="team-cell team-cell-with-name">
                  <app-team-logo [team]="item.team" [animate360]="true"></app-team-logo>
                  <span>{{ item.team }}</span>
                </div>
              </td>
              <td [attr.data-label]="'Partidos'">{{ item.matches || 0 }}</td>
              <td [attr.data-label]="'Tiros a favor'">{{ item.shots_for || 0 }}</td>
              <td [attr.data-label]="'Tiros en contra'">{{ item.shots_against || 0 }}</td>
              <td [attr.data-label]="'Media a favor'">{{ item.avg_shots_for ?? 0 | number:'1.0-2' }}</td>
              <td [attr.data-label]="'Media en contra'">{{ item.avg_shots_against ?? 0 | number:'1.0-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class TeamShotsPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  items: TeamShotTotal[] = [];
  teams: string[] = [];
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getTeamShots({ team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.items = data.items;
    });
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
