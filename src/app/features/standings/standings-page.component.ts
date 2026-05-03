import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { StandingItem } from '../../core/models/api.models';
import { getTeamBrand, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  templateUrl: './standings-page.component.html',
  styleUrl: './standings-page.component.css',
})
export class StandingsPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  items: StandingItem[] = [];
  teams: string[] = [];
  team = '';
  search = '';
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
    this.api.getStandings({
      search: this.search,
      team: this.team,
      page: 1,
      limit: 100,
      league_key: this.leagueKey,
    }).subscribe((data) => {
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

  trackByTeam(_index: number, item: StandingItem): string {
    return `${item.league_key}-${item.position}-${item.team}`;
  }
}
