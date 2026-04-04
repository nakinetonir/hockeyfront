import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { PlayersPageComponent } from './features/players/players-page.component';
import { GoaliesPageComponent } from './features/goalies/goalies-page.component';
import { MatchesPageComponent } from './features/matches/matches-page.component';
import { TeamShotsPageComponent } from './features/team-shots/team-shots-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'jugadores', component: PlayersPageComponent },
  { path: 'porteros', component: GoaliesPageComponent },
  { path: 'partidos', component: MatchesPageComponent },
  { path: 'tiros-equipos', component: TeamShotsPageComponent },
  { path: '**', redirectTo: '' }
];
