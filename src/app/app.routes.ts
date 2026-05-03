import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { PlayersPageComponent } from './features/players/players-page.component';
import { GoaliesPageComponent } from './features/goalies/goalies-page.component';
import { MatchesPageComponent } from './features/matches/matches-page.component';
import { TeamShotsPageComponent } from './features/team-shots/team-shots-page.component';
import { LeagueMenuPageComponent } from './features/league-menu/league-menu-page.component';
import { StandingsPageComponent } from './features/standings/standings-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'liga/:leagueKey', component: LeagueMenuPageComponent },
  { path: 'jugadores', component: PlayersPageComponent },
  { path: 'porteros', component: GoaliesPageComponent },
  { path: 'partidos', component: MatchesPageComponent },
  { path: 'clasificacion', component: StandingsPageComponent },
  { path: 'equipos', component: TeamShotsPageComponent },
  { path: 'tiros-equipos', redirectTo: 'equipos' },
  { path: '**', redirectTo: '' }
];
