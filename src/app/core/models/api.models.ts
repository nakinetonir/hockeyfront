export interface PlayerTotal {
  _id?: string;
  player: string;
  team?: string;
  matches?: number;
  goals?: number;
  assists?: number;
  points?: number;
}

export interface GoalieTotal {
  _id?: string;
  goalie: string;
  team?: string;
  matches?: number;
  goals_allowed?: number;
  shots?: number;
  saves?: number;
  save_pct?: number;
}

export interface TeamSummary {
  _id?: string;
  team: string;
  matches?: number;
  goals_for?: number;
  goals_against?: number;
  shots_for?: number;
  shots_against?: number;
  avg_goals_for?: number | null;
  avg_goals_against?: number | null;
  avg_shots_for?: number | null;
  avg_shots_against?: number | null;
}

export interface MatchItem {
  _id?: string;
  match_id?: string;
  title?: string;
  league_name?: string;
  season?: string;
  date?: string;
  home_team?: string;
  away_team?: string;
  home_score?: number;
  away_score?: number;
  venue?: string;
  status?: string;
  detail_url?: string;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totalMatches: number;
  totalPlayers: number;
  totalGoalies: number;
  topScorers: PlayerTotal[];
  topAssisters: PlayerTotal[];
  topGoalies: GoalieTotal[];
  topTeams: TeamSummary[];
}

export interface AnalysisVideo {
  titulo: string;
  url: string;
}

export interface AnalysisExercise {
  nombre: string;
  descripcion: string;
  objetivo: string;
}

export interface AnalysisConclusion {
  resumen: string;
  nivel: string;
}

export interface PlayerAnalysisResponse {
  nombre: string;
  equipo: string;
  analisis: string;
  puntos_mejora: string[];
  ejercicios: AnalysisExercise[];
  videos: AnalysisVideo[];
  conclusion: AnalysisConclusion;
}
