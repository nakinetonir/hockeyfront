import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary, GoalieTotal, MatchItem, PaginationResult, PlayerTotal, TeamShotTotal } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/summary`);
  }

  getPlayers(filters: Record<string, string | number>): Observable<PaginationResult<PlayerTotal>> {
    return this.http.get<PaginationResult<PlayerTotal>>(`${this.baseUrl}/players`, { params: this.toParams(filters) });
  }

  getGoalies(filters: Record<string, string | number>): Observable<PaginationResult<GoalieTotal>> {
    return this.http.get<PaginationResult<GoalieTotal>>(`${this.baseUrl}/goalies`, { params: this.toParams(filters) });
  }

  getMatches(filters: Record<string, string | number>): Observable<PaginationResult<MatchItem>> {
    return this.http.get<PaginationResult<MatchItem>>(`${this.baseUrl}/matches`, { params: this.toParams(filters) });
  }

  getTeamShots(filters: Record<string, string | number>): Observable<PaginationResult<TeamShotTotal>> {
    return this.http.get<PaginationResult<TeamShotTotal>>(`${this.baseUrl}/team-shots`, { params: this.toParams(filters) });
  }

  getTeams(): Observable<{ items: string[] }> {
    return this.http.get<{ items: string[] }>(`${this.baseUrl}/teams`);
  }

  private toParams(filters: Record<string, string | number>): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
