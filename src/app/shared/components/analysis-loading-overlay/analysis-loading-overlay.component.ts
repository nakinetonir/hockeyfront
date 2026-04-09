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
  template: `
    <div class="analysis-loader-backdrop" *ngIf="open" aria-live="polite" aria-busy="true">
      <div class="analysis-loader-card">
        <div class="ice-glow"></div>

        <div class="loader-topline">Analizando rendimiento</div>
        <h2>{{ title }}</h2>
        <p class="loader-subtitle">{{ subtitle }}</p>

        <div class="fun-match-log" *ngIf="scenarioHome && scenarioAway" aria-label="Bitácora ficticia de espera">
          <div class="fun-match-log__eyebrow">Partido ficticio mientras espera</div>
          <div class="fun-match-log__match">{{ scenarioHome }} vs {{ scenarioAway }}</div>
          <div class="fun-match-log__score">
            {{ scenarioHome }} {{ visibleHomeScore }} - {{ visibleAwayScore }} {{ scenarioAway }}
          </div>

          <div class="fun-match-log__list" #logList>
            <div
              class="fun-match-log__item"
              *ngFor="let entry of matchLog; let i = index"
              [class.fun-match-log__item--active]="i === activeLogIndex"
            >
              {{ formatMinute(entry.minute) }} · {{ entry.text }}
            </div>

            <div class="fun-match-log__item fun-match-log__item--pending" *ngIf="matchLog.length < scenarioEntries.length">
              {{ nextMinuteLabel }} · El partido sigue avanzando...
            </div>
          </div>
        </div>

        <div class="rink-scene" aria-hidden="true">
          <div class="ice-track"></div>
          <div class="ice-lines ice-lines-top"></div>
          <div class="ice-lines ice-lines-bottom"></div>

          <div class="goal goal-left">
            <span></span><span></span><span></span>
          </div>

          <div class="goal goal-right">
            <span></span><span></span><span></span>
          </div>

          <div class="player player-one">
            <div class="stick"></div>
          </div>
          <div class="player player-two">
            <div class="stick"></div>
          </div>
          <div class="player player-three">
            <div class="stick"></div>
          </div>

          <div class="puck-trail"></div>
          <div class="puck"></div>
        </div>

        <div class="loader-steps">
          <div class="step active"><span></span><label>Consultando workflow</label></div>
          <div class="step active delayed-1"><span></span><label>Procesando estadísticas</label></div>
          <div class="step active delayed-2"><span></span><label>Preparando recomendaciones</label></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analysis-loader-backdrop {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 1200;
      background:
        radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 30%),
        radial-gradient(circle at bottom, rgba(34, 197, 94, 0.12), transparent 24%),
        rgba(2, 6, 23, 0.78);
      backdrop-filter: blur(12px);
    }

    .analysis-loader-card {
      position: relative;
      width: min(760px, 100%);
      overflow: hidden;
      border-radius: 28px;
      padding: 28px 28px 24px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      background:
        linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.96));
      box-shadow:
        0 30px 80px rgba(2, 6, 23, 0.65),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .ice-glow {
      position: absolute;
      inset: -30% auto auto 50%;
      width: 320px;
      height: 320px;
      border-radius: 999px;
      transform: translateX(-50%);
      background: radial-gradient(circle, rgba(56, 189, 248, 0.24), rgba(56, 189, 248, 0) 70%);
      filter: blur(10px);
      pointer-events: none;
      animation: pulseGlow 2.8s ease-in-out infinite;
    }

    .loader-topline {
      position: relative;
      display: inline-flex;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: #7dd3fc;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      z-index: 1;
    }

    h2 {
      position: relative;
      margin: 16px 0 6px;
      font-size: clamp(1.5rem, 2vw, 2.2rem);
      line-height: 1.1;
      z-index: 1;
      max-width: calc(100% - 320px);
    }

    .loader-subtitle {
      position: relative;
      z-index: 1;
      margin: 0 0 22px;
      color: #cbd5e1;
      max-width: min(58ch, calc(100% - 320px));
    }

    .fun-match-log {
      position: absolute;
      top: 22px;
      right: 22px;
      width: 276px;
      max-width: calc(100% - 44px);
      padding: 14px;
      border-radius: 18px;
      border: 1px solid rgba(125, 211, 252, 0.18);
      background: linear-gradient(180deg, rgba(8, 15, 30, 0.9), rgba(15, 23, 42, 0.72));
      box-shadow: 0 12px 30px rgba(2, 6, 23, 0.28);
      z-index: 2;
    }

    .fun-match-log__eyebrow {
      color: #7dd3fc;
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .fun-match-log__match {
      font-size: 0.92rem;
      font-weight: 700;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .fun-match-log__score {
      margin-top: 4px;
      color: #bef264;
      font-weight: 800;
      font-size: 0.94rem;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    .fun-match-log__list {
      display: grid;
      gap: 7px;
      margin-top: 12px;
      max-height: 320px;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-right: 4px;
    }

    .fun-match-log__list::-webkit-scrollbar {
      width: 8px;
    }

    .fun-match-log__list::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.18);
      border-radius: 999px;
    }

    .fun-match-log__list::-webkit-scrollbar-thumb {
      background: rgba(125, 211, 252, 0.28);
      border-radius: 999px;
    }

    .fun-match-log__item {
      padding: 8px 10px;
      border-radius: 12px;
      color: #cbd5e1;
      background: rgba(30, 41, 59, 0.6);
      font-size: 0.8rem;
      line-height: 1.4;
      border: 1px solid rgba(148, 163, 184, 0.08);
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
      overflow-wrap: anywhere;
    }

    .fun-match-log__item--active {
      transform: translateX(-4px);
      border-color: rgba(125, 211, 252, 0.35);
      background: rgba(14, 116, 144, 0.16);
      color: #f8fafc;
    }

    .fun-match-log__item--pending {
      opacity: 0.72;
      font-style: italic;
    }

    .rink-scene {
      position: relative;
      height: 240px;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(148, 163, 184, 0.18);
      background:
        radial-gradient(circle at 50% 46%, rgba(255,255,255,0.4) 0 2px, transparent 3px),
        linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(226, 232, 240, 0.88));
      box-shadow: inset 0 2px 30px rgba(255,255,255,0.35), inset 0 -20px 30px rgba(148, 163, 184, 0.2);
    }

    .ice-track,
    .ice-lines,
    .goal,
    .player,
    .puck,
    .puck-trail {
      position: absolute;
    }

    .ice-track {
      inset: 24px 28px;
      border-radius: 999px;
      border: 3px solid rgba(239, 68, 68, 0.78);
      box-shadow: inset 0 0 0 5px rgba(255,255,255,0.45);
    }

    .ice-track::before,
    .ice-track::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      background: rgba(59, 130, 246, 0.8);
    }

    .ice-track::before { left: 28%; }
    .ice-track::after { right: 28%; }

    .ice-lines {
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      border-top: 4px solid rgba(239, 68, 68, 0.72);
    }

    .ice-lines-top { top: 48px; }
    .ice-lines-bottom { bottom: 48px; }

    .goal {
      top: 50%;
      width: 56px;
      height: 32px;
      transform: translateY(-50%);
      border: 3px solid rgba(239, 68, 68, 0.75);
      border-top-width: 5px;
      border-radius: 8px;
      background: rgba(248, 250, 252, 0.45);
    }

    .goal span {
      position: absolute;
      inset: 0;
      border-left: 1px solid rgba(239, 68, 68, 0.25);
    }

    .goal span:nth-child(1) { left: 33%; }
    .goal span:nth-child(2) { left: 66%; }
    .goal span:nth-child(3) {
      inset: auto 0 33% 0;
      border-left: 0;
      border-top: 1px solid rgba(239, 68, 68, 0.25);
    }

    .goal-left { left: 34px; }
    .goal-right { right: 34px; }

    .player {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      background: linear-gradient(180deg, #0f172a, #1e293b);
      border: 3px solid #38bdf8;
      box-shadow: 0 12px 18px rgba(15, 23, 42, 0.2);
    }

    .player::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 9px;
      height: 9px;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background: #e2e8f0;
    }

    .player .stick {
      position: absolute;
      right: -10px;
      bottom: -2px;
      width: 15px;
      height: 4px;
      border-radius: 999px;
      background: #7c3aed;
      transform-origin: left center;
      transform: rotate(28deg);
    }

    .player-one {
      left: 21%;
      top: 48%;
      animation: skateOne 3.1s ease-in-out infinite;
    }

    .player-two {
      left: 41%;
      top: 60%;
      border-color: #22c55e;
      animation: skateTwo 2.8s ease-in-out infinite;
    }

    .player-three {
      left: 67%;
      top: 44%;
      border-color: #f59e0b;
      animation: skateThree 3.4s ease-in-out infinite;
    }

    .puck {
      left: 19%;
      top: 58%;
      width: 15px;
      height: 15px;
      border-radius: 999px;
      background: #0f172a;
      box-shadow: 0 4px 8px rgba(15, 23, 42, 0.2);
      animation: puckMove 3.2s ease-in-out infinite;
    }

    .puck-trail {
      left: 18%;
      top: 60%;
      width: 52px;
      height: 4px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0.65));
      filter: blur(1px);
      animation: trailMove 3.2s ease-in-out infinite;
    }

    .loader-steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 18px;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 14px;
      color: #cbd5e1;
      background: rgba(15, 23, 42, 0.62);
      border: 1px solid rgba(148, 163, 184, 0.15);
    }

    .step span {
      width: 11px;
      height: 11px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.35);
      box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4);
      animation: blink 1.4s ease-in-out infinite;
    }

    .step label {
      font-size: 0.92rem;
      font-weight: 600;
    }

    .delayed-1 span { animation-delay: 0.2s; }
    .delayed-2 span { animation-delay: 0.4s; }

    @keyframes pulseGlow {
      0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(0.95); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
    }

    @keyframes skateOne {
      0%, 100% { transform: translate(0, -36px) rotate(-4deg); }
      35% { transform: translate(70px, -50px) rotate(6deg); }
      70% { transform: translate(110px, -26px) rotate(-2deg); }
    }

    @keyframes skateTwo {
      0%, 100% { transform: translate(0, 18px) rotate(0deg); }
      35% { transform: translate(46px, 28px) rotate(-7deg); }
      70% { transform: translate(-22px, 8px) rotate(5deg); }
    }

    @keyframes skateThree {
      0%, 100% { transform: translate(0, -12px) rotate(4deg); }
      35% { transform: translate(-58px, -28px) rotate(-8deg); }
      70% { transform: translate(-92px, 4px) rotate(6deg); }
    }

    @keyframes puckMove {
      0% { transform: translate(0, 0) scale(1); }
      22% { transform: translate(180px, -42px) scale(1.05); }
      48% { transform: translate(328px, 16px) scale(0.95); }
      72% { transform: translate(458px, -18px) scale(1.02); }
      100% { transform: translate(0, 0) scale(1); }
    }

    @keyframes trailMove {
      0% { opacity: 0; transform: translateX(0) scaleX(0.4); }
      10% { opacity: 0.8; }
      48% { opacity: 0.75; transform: translateX(200px) scaleX(1.25); }
      72% { opacity: 0.55; transform: translateX(350px) scaleX(1.1); }
      100% { opacity: 0; transform: translateX(0) scaleX(0.4); }
    }

    @keyframes blink {
      0%, 100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.3); background: rgba(56, 189, 248, 0.55); }
      50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); background: rgba(34, 197, 94, 0.9); }
    }

    @media (max-width: 720px) {
      .analysis-loader-card {
        padding: 20px;
      }

      h2,
      .loader-subtitle {
        max-width: 100%;
      }

      .fun-match-log {
        position: relative;
        top: auto;
        right: auto;
        width: 100%;
        margin: 0 0 16px;
      }

      .fun-match-log__list {
        max-height: 220px;
      }

      .rink-scene {
        height: 200px;
      }

      .loader-steps {
        grid-template-columns: 1fr;
      }
    }
  `]
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
