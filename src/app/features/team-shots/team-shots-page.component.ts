import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { TeamSummary } from '../../core/models/api.models';
import { getTeamBrand, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-team-shots-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  templateUrl: './team-shots-page.component.html',
  styleUrl: './team-shots-page.component.css',
})
export class TeamShotsPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  items: TeamSummary[] = [];
  teams: string[] = [];
  team = '';
  leagueKey = '';
  leagueName = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.leagueKey = params.get('league_key') || '';
      this.leagueName = params.get('league_name') || '';
      this.api.getTeams(this.leagueKey ? { league_key: this.leagueKey } : {}).subscribe((data) => (this.teams = data.items));
      this.load();
    });
  }

  load(): void {
    this.api.getTeamStats({ team: this.team, page: 1, limit: 100, league_key: this.leagueKey }).subscribe((data) => {
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
