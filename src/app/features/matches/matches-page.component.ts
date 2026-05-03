import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatchItem } from '../../core/models/api.models';
import { ApiService } from '../../core/services/api.service';
import { filterByTeamText, isTeam360 } from '../../core/utils/team-branding';
import { TeamLogoComponent } from '../../shared/components/team-logo/team-logo.component';

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TeamLogoComponent],
  templateUrl: './matches-page.component.html',
  styleUrl: './matches-page.component.css',
})
export class MatchesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  matches: MatchItem[] = [];
  filteredMatches: MatchItem[] = [];
  teams: string[] = [];
  search = '';
  teamSearch = '';
  team = '';
  leagueKey = '';
  leagueName = '';
  selectedMatch: MatchItem | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.leagueKey = params.get('league_key') || '';
      this.leagueName = params.get('league_name') || '';
      this.api.getTeams(this.leagueKey ? { league_key: this.leagueKey } : {}).subscribe((data) => (this.teams = data.items));
      this.load();
    });
  }

  load(): void {
    this.api.getMatches({ search: this.search, team: this.team, page: 1, limit: 100, league_key: this.leagueKey }).subscribe((data) => {
      this.matches = [...data.items].sort((a, b) => this.getMatchTimestamp(b.date) - this.getMatchTimestamp(a.date));
      this.applyTeamFilter();
    });
  }

  applyTeamFilter(): void {
    this.filteredMatches = filterByTeamText(
      this.matches,
      (item) => `${item.home_team || ''} ${item.away_team || ''}`,
      this.teamSearch
    ).sort((a, b) => this.getMatchTimestamp(b.date) - this.getMatchTimestamp(a.date));
  }

  openMatch(match: MatchItem): void {
    this.selectedMatch = match;
  }

  closeMatch(): void {
    this.selectedMatch = null;
  }

  private getMatchTimestamp(dateValue?: string | null): number {
    if (!dateValue) {
      return 0;
    }

    const normalized = dateValue.trim();
    const ddmmyyyy = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);

    if (ddmmyyyy) {
      const [, day, month, year, hour = '0', minute = '0'] = ddmmyyyy;
      return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).getTime();
    }

    const parsed = Date.parse(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  is360(team?: string): boolean {
    return isTeam360(team);
  }
}
