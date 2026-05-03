import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

interface MatchLogEntry {
  minute: number;
  text: string;
  homeScore: number;
  awayScore: number;
}

interface MatchLogScenario {
  home: string;
  away: string;
  entries: MatchLogEntry[];
}

@Component({
  selector: 'app-analysis-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-loading-overlay.component.html',
  styleUrl: './analysis-loading-overlay.component.css',
})
export class AnalysisLoadingOverlayComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() title = 'Preparando análisis personalizado';
  @Input() subtitle = 'Estamos consultando el workflow y construyendo recomendaciones con estadísticas, ejercicios y vídeos.';
  @Input() teams: string[] = [];

  @ViewChild('logList') private logList?: ElementRef<HTMLDivElement>;


  matchLog: MatchLogEntry[] = [];
  scenarioEntries: MatchLogEntry[] = [];
  scenarioHome = '';
  scenarioAway = '';
  visibleHomeScore = 0;
  visibleAwayScore = 0;
  activeLogIndex = 0;

  private revealTimer: ReturnType<typeof setInterval> | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  get nextMinuteLabel(): string {
    const nextEntry = this.scenarioEntries[this.matchLog.length];
    return this.formatMinute(nextEntry?.minute ?? 1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('open' in changes) {
      if (this.open) {
        this.startFunLog();
      } else {
        this.stopFunLog();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopFunLog();
  }

  formatMinute(value: number): string {
    return `${value}'`;
  }

  private scrollLogToBottom(): void {
    setTimeout(() => {
      const element = this.logList?.nativeElement;
      if (!element) {
        return;
      }

      element.scrollTop = element.scrollHeight;
    });
  }

  private scrollLogToTop(): void {
    setTimeout(() => {
      const element = this.logList?.nativeElement;
      if (!element) {
        return;
      }

      element.scrollTop = 0;
    });
  }

  private startFunLog(): void {
    this.buildScenario();
    this.stopTimers();

    this.revealTimer = setInterval(() => {
      if (this.matchLog.length >= this.scenarioEntries.length) {
        return;
      }

      this.matchLog = [...this.matchLog, this.scenarioEntries[this.matchLog.length]];
      this.activeLogIndex = this.matchLog.length - 1;

      const current = this.matchLog[this.activeLogIndex];
      this.visibleHomeScore = current.homeScore;
      this.visibleAwayScore = current.awayScore;
      this.scrollLogToBottom();
    }, 1700);

    this.refreshTimer = setInterval(() => {
      this.buildScenario();
    }, 13500);
  }

  private stopFunLog(): void {
    this.stopTimers();
    this.activeLogIndex = 0;
    this.matchLog = [];
    this.scenarioEntries = [];
    this.visibleHomeScore = 0;
    this.visibleAwayScore = 0;
    this.scrollLogToTop();
  }

  private stopTimers(): void {
    if (this.revealTimer) {
      clearInterval(this.revealTimer);
      this.revealTimer = null;
    }

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private buildScenario(): void {
    const scenario = this.generateScenario();
    this.scenarioHome = scenario.home;
    this.scenarioAway = scenario.away;
    this.scenarioEntries = scenario.entries;
    this.matchLog = [];
    this.activeLogIndex = 0;
    this.visibleHomeScore = 0;
    this.visibleAwayScore = 0;
    this.scrollLogToTop();
  }

  private generateScenario(): MatchLogScenario {
    const knownTeams = this.teams.filter((team) => !!team?.trim());
    const fallbackTeams = [
      'Club Tres60',
      'CHC Las Rozas',
      'Lobos',
      'Madrid Patina',
      'Mamuts de Villaverde',
      'Pinguinos',
      'Ciudad Patin Renos',
      'Rollybears Parla',
      'Club Patín Tirso',
      'CPLG Vikings'
    ];

    const pool = (knownTeams.length >= 2 ? knownTeams : fallbackTeams).map((team) => team.trim());
    const home = this.pickOne(pool);
    const away = this.pickOne(pool.filter((team) => team !== home)) ?? pool.find((team) => team !== home) ?? 'Rival';

    const homeScorers = ['Hernández', 'Santos', 'Velasco', 'Prieto', 'Martín', 'Gonzalo'];
    const awayScorers = ['Rey', 'Navas', 'Muñiz', 'Campos', 'Ortega', 'Ruiz'];

    let homeScore = 0;
    let awayScore = 0;

    const entries: MatchLogEntry[] = [
      {
        minute: this.randomRange(2, 6),
        text: `Comienza la primera parte con mucha intensidad entre ${home} y ${away}.`,
        homeScore,
        awayScore
      }
    ];

    homeScore += 1;
    entries.push({
      minute: this.randomRange(7, 14),
      text: `Gol de ${this.pickOne(homeScorers)} para ${home} tras una jugada rápida por la banda.`,
      homeScore,
      awayScore
    });

    if (Math.random() > 0.45) {
      awayScore += 1;
      entries.push({
        minute: this.randomRange(15, 22),
        text: `Empata ${away} con un disparo lejano de ${this.pickOne(awayScorers)}.`,
        homeScore,
        awayScore
      });
    } else {
      entries.push({
        minute: this.randomRange(15, 22),
        text: `Paradón del portero de ${away} para mantener vivo el partido.`,
        homeScore,
        awayScore
      });
    }

    entries.push({
      minute: 25,
      text: `Descanso. Primera parte cerrada y mucha tensión en la pista.`,
      homeScore,
      awayScore
    });

    entries.push({
      minute: this.randomRange(28, 33),
      text: `Arranca la segunda parte con posesiones largas y cambios constantes.`,
      homeScore,
      awayScore
    });

    if (Math.random() > 0.5) {
      entries.push({
        minute: this.randomRange(34, 40),
        text: `Expulsión temporal en ${away} por una entrada dura en la zona neutra.`,
        homeScore,
        awayScore
      });
    } else {
      entries.push({
        minute: this.randomRange(34, 40),
        text: `Expulsión temporal en ${home} y partido completamente abierto.`,
        homeScore,
        awayScore
      });
    }

    if (Math.random() > 0.35) {
      homeScore += 1;
      entries.push({
        minute: this.randomRange(41, 47),
        text: `${home} vuelve a golpear con un remate de ${this.pickOne(homeScorers)} en el segundo palo.`,
        homeScore,
        awayScore
      });
    } else {
      awayScore += 1;
      entries.push({
        minute: this.randomRange(41, 47),
        text: `${away} culmina la remontada con un contraataque final de ${this.pickOne(awayScorers)}.`,
        homeScore,
        awayScore
      });
    }

    entries.push({
      minute: 50,
      text: `Final del partido ficticio. Marcador cerrado mientras termina el workflow.`,
      homeScore,
      awayScore
    });

    return {
      home,
      away,
      entries: entries.sort((a, b) => a.minute - b.minute)
    };
  }

  private randomRange(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  private pickOne<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
