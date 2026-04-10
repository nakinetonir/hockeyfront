import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { TeamSummary } from '../../core/models/api.models';
import { getTeamBrand, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-team-shots-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  template: `
    <section>
      <h1 class="page-title">Equipos</h1>
      <p class="page-subtitle">Totales y medias de goles y tiros a favor y en contra por equipo.</p>

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
              <th>GF</th>
              <th>GC</th>
              <th>TF</th>
              <th>TC</th>
              <th>Media GF</th>
              <th>Media GC</th>
              <th>Media TF</th>
              <th>Media TC</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of items"
              [class.team-360-row]="is360(item.team)"
              class="team-watermark-row team-stats-row"
              [style.--team-logo-url]="getTeamLogoCss(item.team)"
            >
              <td [attr.data-label]="'Equipo'" class="team-data-cell">
                <div class="team-cell team-cell-with-name team-cell-mobile-centered">
                  <app-team-logo class="team-shots-main-logo" [team]="item.team" [animate360]="true"></app-team-logo>
                  <span class="team-name-text">{{ item.team }}</span>
                </div>
              </td>
              <td [attr.data-label]="'Partidos'">{{ item.matches || 0 }}</td>
              <td [attr.data-label]="'GF'">{{ item.goals_for || 0 }}</td>
              <td [attr.data-label]="'GC'">{{ item.goals_against || 0 }}</td>
              <td [attr.data-label]="'TF'">{{ item.shots_for || 0 }}</td>
              <td [attr.data-label]="'TC'">{{ item.shots_against || 0 }}</td>
              <td [attr.data-label]="'Media GF'">{{ item.avg_goals_for ?? 0 | number:'1.0-2' }}</td>
              <td [attr.data-label]="'Media GC'">{{ item.avg_goals_against ?? 0 | number:'1.0-2' }}</td>
              <td [attr.data-label]="'Media TF'">{{ item.avg_shots_for ?? 0 | number:'1.0-2' }}</td>
              <td [attr.data-label]="'Media TC'">{{ item.avg_shots_against ?? 0 | number:'1.0-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class TeamShotsPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  items: TeamSummary[] = [];
  teams: string[] = [];
  team = '';

  ngOnInit(): void {
    this.api.getTeams().subscribe((data) => (this.teams = data.items));
    this.load();
  }

  load(): void {
    this.api.getTeamStats({ team: this.team, page: 1, limit: 100 }).subscribe((data) => {
      this.items = data.items;
    });
  }



  getTeamLogoCss(team?: string): string | null {
    const logo = getTeamBrand(team)?.logo;
    return logo ? `url("${logo}")` : null;
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
