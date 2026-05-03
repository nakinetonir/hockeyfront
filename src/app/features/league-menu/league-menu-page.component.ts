import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { DashboardSummary } from '../../core/models/api.models';

interface MenuCard {
  title: string;
  label: string;
  description: string;
  route: string;
  accent: string;
  icon: string;
  metric?: keyof DashboardSummary | 'teams';
}

@Component({
  selector: 'app-league-menu-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="league-shell">
      <div class="league-bg league-bg-one"></div>
      <div class="league-bg league-bg-two"></div>

      <header class="league-hero">
        <div class="hero-copy">
         
          <h1>{{ leagueName }}</h1>
        </div>
      </header>

      <section class="menu-section">
       

        <div class="menu-grid">
          <a
            *ngFor="let card of cards"
            class="menu-card"
            [routerLink]="card.route"
            [queryParams]="queryParams"
            [style.--card-accent]="card.accent"
          >
            <div class="menu-card-glow"></div>
            <div class="menu-card-top">
              <span class="menu-icon">{{ card.icon }}</span>
              <div class="menu-card-metric" *ngIf="summary as data">
                <span>Total</span>
                <strong>{{ metricValue(card, data) }}</strong>
              </div>
            </div>
            <div class="menu-card-main">
              <h3>{{ card.title }}</h3>
            </div>
            <p>{{ card.description }}</p>
          </a>
        </div>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .league-shell {
      position: relative;
      padding: clamp(18px, 4vw, 36px) 0 46px;
      overflow: hidden;
      isolation: isolate;
    }

    .league-bg {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      filter: blur(18px);
      opacity: 0.5;
      pointer-events: none;
    }

    .league-bg-one {
      width: 420px;
      height: 420px;
      right: -180px;
      top: 40px;
      background: radial-gradient(circle, rgba(56,189,248,0.22), transparent 70%);
    }

    .league-bg-two {
      width: 360px;
      height: 360px;
      left: -160px;
      bottom: 10%;
      background: radial-gradient(circle, rgba(34,197,94,0.16), transparent 70%);
    }

    .league-hero {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(330px, 0.72fr);
      gap: clamp(24px, 5vw, 54px);
      align-items: center;
      min-height: clamp(260px, 38vh, 420px);      
      padding: clamp(26px, 5vw, 58px);
      overflow: hidden;
      border-radius: clamp(26px, 4vw, 42px);
      border: 1px solid rgba(125, 211, 252, 0.24);
      background:
        linear-gradient(135deg, rgba(8, 18, 34, 0.95), rgba(15, 23, 42, 0.98) 48%, rgba(2, 6, 23, 0.98)),
        radial-gradient(circle at 75% 20%, rgba(14,165,233,0.20), transparent 32%),
        radial-gradient(circle at 10% 90%, rgba(34,197,94,0.15), transparent 30%);
      box-shadow:
        0 34px 100px rgba(2, 6, 23, 0.66),
        inset 0 1px 0 rgba(255,255,255,0.08);
    }

    .league-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 42%, transparent 54%),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 72px),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.026) 0 1px, transparent 1px 72px);
      opacity: 0.38;
      pointer-events: none;
    }

    .league-hero::after {
      content: '';
      position: absolute;
      inset: 16px;
      border-radius: calc(clamp(26px, 4vw, 42px) - 10px);
      border: 1px solid rgba(255,255,255,0.06);
      pointer-events: none;
    }

    .hero-copy,
    .hero-visual {
      position: relative;
      z-index: 1;
    }

    .back-home {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      color: #bae6fd;
      font-weight: 850;
      letter-spacing: 0.01em;
      opacity: 0.92;
      transition: transform .18s ease, color .18s ease;
    }

    .back-home:hover {
      color: #fff;
      transform: translateX(-3px);
    }

    .hero-kicker {
      width: fit-content;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding: 10px 14px;
      border-radius: 999px;
      color: #7dd3fc;
      background: rgba(14, 165, 233, 0.14);
      border: 1px solid rgba(125, 211, 252, 0.28);
      font-size: 0.78rem;
      font-weight: 950;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      box-shadow: 0 10px 26px rgba(14, 165, 233, 0.12);
    }

    .live-dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 0 6px rgba(34,197,94,0.12), 0 0 22px rgba(34,197,94,0.7);
    }

    h1 {
      margin: 0;
      max-width: 760px;
      color: #f8fafc;
      font-size: clamp(3rem, 7.4vw, 7rem);
      line-height: 0.9;
      letter-spacing: -0.075em;
      font-weight: 1000;
      text-wrap: balance;
    }

    .hero-copy p {
      margin: 24px 0 0;
      max-width: 620px;
      color: #c7d2e3;
      font-size: clamp(1rem, 1.6vw, 1.2rem);
      line-height: 1.72;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .hero-primary,
    .hero-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 0 22px;
      border-radius: 999px;
      font-weight: 950;
      text-decoration: none;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }

    .hero-primary {
      color: #031525;
      background: linear-gradient(135deg, #7dd3fc, #38bdf8);
      box-shadow: 0 18px 42px rgba(14, 165, 233, 0.34);
    }

    .hero-secondary {
      color: #dbeafe;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(148, 163, 184, 0.20);
    }

    .hero-primary:hover,
    .hero-secondary:hover {
      transform: translateY(-2px);
    }

    .hero-primary:hover {
      box-shadow: 0 24px 58px rgba(14, 165, 233, 0.44);
    }

    .hero-secondary:hover {
      border-color: rgba(125,211,252,0.45);
      box-shadow: 0 14px 36px rgba(14,165,233,0.12);
    }

    .rink-card {
      position: relative;
      min-height: 390px;
      overflow: hidden;
      border-radius: 40px;
      background:
        linear-gradient(180deg, rgba(224,242,254,0.12), rgba(15,23,42,0.18)),
        radial-gradient(circle at 50% 50%, rgba(125,211,252,0.16), transparent 34%);
      border: 1px solid rgba(226,232,240,0.16);
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.04),
        inset 0 0 54px rgba(14,165,233,0.12),
        0 30px 80px rgba(0,0,0,0.36);
    }

    .rink-line {
      position: absolute;
      background: linear-gradient(180deg, transparent, rgba(125,211,252,0.42), transparent);
    }

    .rink-line-v {
      left: 50%;
      top: 0;
      width: 1px;
      height: 100%;
      transform: translateX(-50%);
    }

    .rink-line-h {
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      transform: translateY(-50%);
      background: linear-gradient(90deg, transparent, rgba(125,211,252,0.42), transparent);
    }

    .puck {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 62px;
      height: 62px;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background:
        radial-gradient(circle at 35% 30%, rgba(255,255,255,0.20), transparent 24%),
        linear-gradient(135deg, #020617, #111827);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    }

    .floating-logo {
      position: absolute;
      width: clamp(92px, 9vw, 142px);
      height: clamp(92px, 9vw, 142px);
      object-fit: contain;
      padding: 16px;
      border-radius: 30px;
      background: rgba(248,250,252,0.92);
      box-shadow: 0 24px 48px rgba(0,0,0,0.34);
      filter: saturate(1.08);
    }

    .logo-a { left: 8%; top: 10%; transform: rotate(-9deg); }
    .logo-b { right: 8%; top: 22%; transform: rotate(10deg); }
    .logo-c { left: 30%; bottom: 7%; transform: rotate(7deg); }
    .logo-d { right: 28%; bottom: 10%; transform: rotate(-6deg); opacity: .92; }

    .menu-section {
      margin-top: 34px;
    }

    .section-heading span {
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: .18em;
      font-size: .78rem;
      font-weight: 1000;
    }

    .section-heading h2 {
      margin: 8px 0 22px;
      color: #f8fafc;
      font-size: clamp(2.1rem, 5vw, 4.2rem);
      line-height: .95;
      letter-spacing: -0.07em;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }

    .menu-card {
      --card-accent: #38bdf8;
      position: relative;
      isolation: isolate;
      min-height: 245px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      padding: 22px;
      border-radius: 28px;
      text-decoration: none;
      color: inherit;
      background:
        linear-gradient(145deg, rgba(15,23,42,0.94), rgba(17,24,39,0.82)),
        radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--card-accent) 24%, transparent), transparent 46%);
      border: 1px solid rgba(148,163,184,0.20);
      box-shadow: 0 18px 54px rgba(2,6,23,0.34);
      transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
    }

    .menu-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 45%, transparent 58%),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 54px);
      opacity: .28;
      pointer-events: none;
      z-index: -1;
    }

    .menu-card-glow {
      position: absolute;
      right: -40px;
      top: -40px;
      width: 150px;
      height: 150px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-accent) 30%, transparent);
      filter: blur(8px);
      opacity: .65;
      z-index: -1;
    }

    .menu-card:hover {
      transform: translateY(-7px) scale(1.015);
      border-color: color-mix(in srgb, var(--card-accent) 55%, rgba(255,255,255,0.1));
      box-shadow: 0 26px 70px rgba(2,6,23,0.44), 0 0 34px color-mix(in srgb, var(--card-accent) 18%, transparent);
    }

    .menu-card-top,
    .menu-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .menu-icon {
      display: inline-grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 18px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      font-size: 1.35rem;
    }

    .menu-card h3 {
      margin: 30px 0 0;
      color: #f8fafc;
      font-size: clamp(1.6rem, 2.2vw, 2.35rem);
      line-height: 1;
      letter-spacing: -0.06em;
    }

    .menu-card-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
    }

    .menu-card-metric {
      display: grid;
      justify-items: start;
      gap: 3px;
      min-width: 58px;
      min-height: 58px;
      align-content: center;
      padding: 8px 12px;
      border-radius: 18px;
      background: color-mix(in srgb, var(--card-accent) 14%, rgba(255,255,255,.04));
      border: 1px solid color-mix(in srgb, var(--card-accent) 28%, transparent);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
    }

    .menu-card-metric span {
      color: color-mix(in srgb, var(--card-accent) 74%, #fff);
      font-size: .64rem;
      font-weight: 1000;
      letter-spacing: .13em;
      text-transform: uppercase;
    }

    .menu-card-metric strong {
      color: #fff;
      font-size: clamp(1.55rem, 2.55vw, 2.15rem);
      line-height: .9;
      letter-spacing: -0.06em;
    }

    .menu-card p {
      margin: 12px 0 0;
      color: #b8c5d8;
      line-height: 1.6;
    }

    .menu-card-footer {
      margin-top: 24px;
      color: #f8fafc;
      font-weight: 950;
    }

    .menu-card-footer strong {
      display: inline-grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      color: #031525;
      background: linear-gradient(135deg, #e0f2fe, var(--card-accent));
      box-shadow: 0 14px 32px color-mix(in srgb, var(--card-accent) 24%, transparent);
    }

    @media (max-width: 980px) {
      .league-hero {
        grid-template-columns: 1fr;
      }

      .hero-visual {
        order: -1;
      }

      .rink-card {
        min-height: 300px;
      }

      .menu-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .league-shell {
        padding-top: 12px;
        padding: 1rem;
      }

      .league-hero {
        padding: 22px;
        border-radius: 28px;
      }

      h1 {
        font-size: clamp(2.55rem, 16vw, 4.5rem);
      }

      .hero-copy p {
        font-size: .98rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .hero-primary,
      .hero-secondary {
        width: 100%;
      }

      .rink-card {
        min-height: 250px;
        border-radius: 28px;
      }

      .floating-logo {
        width: 94px;
        height: 94px;
        padding: 12px;
        border-radius: 24px;
      }

      .logo-a { left: 5%; top: 9%; }
      .logo-b { right: 3%; top: 22%; }
      .logo-c { left: 27%; bottom: 6%; }
      .logo-d { right: 28%; bottom: 7%; }

      .menu-grid {
        grid-template-columns: 1fr;
      }

      .menu-card {
        min-height: 220px;
        border-radius: 24px;
      }

      .menu-card-main {
        align-items: flex-start;
      }

      .menu-card-metric {
        min-width: 54px;
        min-height: 54px;
        padding: 7px 10px;
      }
    }

    /* Compact selected league hero on mobile */
    @media (max-width: 640px) {
      .league-hero {
        min-height: 170px !important;
        padding: 16px 18px !important;
        border-radius: 24px !important;
        display: flex !important;
        align-items: center !important;
      }

      .league-hero::after {
        inset: 10px !important;
        border-radius: 18px !important;
      }

      .hero-copy {
        width: 100% !important;
      }

      h1 {
        font-size: clamp(2.25rem, 12vw, 3.35rem) !important;
        line-height: .92 !important;
        letter-spacing: -0.07em !important;
      }
    }

    @media (max-width: 420px) {
      .league-hero {
        min-height: 150px !important;
        padding: 14px 16px !important;
      }

      h1 {
        font-size: clamp(2rem, 11vw, 3rem) !important;
      }
    }

  `]
})
export class LeagueMenuPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  private readonly allLogos = [
    '/assets/teams/360.png',
    '/assets/teams/cplm.png',
    '/assets/teams/lasrozas.png',
    '/assets/teams/lobos.png',
    '/assets/teams/madridpatina.png',
    '/assets/teams/mamuts.png',
    '/assets/teams/pinguinos.png',
    '/assets/teams/renos.png',
    '/assets/teams/rolleybeers.png',
    '/assets/teams/sobre8ruedas.png',
    '/assets/teams/tirso.png',
    '/assets/teams/trescantos.png',
    '/assets/teams/vikings.png'
  ];

  private readonly leagueLogoGroups: string[][] = [
    ['/assets/teams/cplm.png', '/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png', '/assets/teams/vikings.png'],
    ['/assets/teams/360.png', '/assets/teams/lasrozas.png', '/assets/teams/lobos.png', '/assets/teams/madridpatina.png'],
    ['/assets/teams/madridpatina.png', '/assets/teams/mamuts.png', '/assets/teams/pinguinos.png', '/assets/teams/renos.png'],
    ['/assets/teams/renos.png', '/assets/teams/rolleybeers.png', '/assets/teams/tirso.png', '/assets/teams/360.png'],
    ['/assets/teams/vikings.png', '/assets/teams/cplm.png', '/assets/teams/lasrozas.png', '/assets/teams/lobos.png'],
    ['/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png', '/assets/teams/pinguinos.png', '/assets/teams/mamuts.png']
  ];

  private readonly cardsBase: MenuCard[] = [
    {
      title: 'Equipos',
      label: 'Rendimiento',
      description: 'Totales, medias, goles y tiros a favor y en contra por equipo.',
      route: '/equipos',
      accent: '#38bdf8',
      icon: '🛡️',
      metric: 'teams'
    },
    {
      title: 'Jugadores',
      label: 'Ataque',
      description: 'Goles, asistencias, puntos y ranking individual de la competición.',
      route: '/jugadores',
      accent: '#22c55e',
      icon: '⚡',
      metric: 'totalPlayers'
    },
    {
      title: 'Porteros',
      label: 'Portería',
      description: 'Paradas, tiros recibidos, goles encajados y porcentaje de parada.',
      route: '/porteros',
      accent: '#a78bfa',
      icon: '🥅',
      metric: 'totalGoalies'
    },
    {
      title: 'Partidos',
      label: 'Calendario',
      description: 'Resultados, enfrentamientos, sedes y detalle de cada encuentro.',
      route: '/partidos',
      accent: '#fb923c',
      icon: '🏒',
      metric: 'totalMatches'
    }
  ];

  leagueKey = '';
  leagueName = 'Liga';
  queryParams: Record<string, string> = {};
  summary?: DashboardSummary;
  selectedLogos = this.leagueLogoGroups[0];
  cards = this.cardsBase;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.leagueKey = params.get('leagueKey') || '';
      this.leagueName = this.route.snapshot.queryParamMap.get('league_name') || this.humanizeLeagueKey(this.leagueKey);
      this.queryParams = { league_key: this.leagueKey, league_name: this.leagueName };
      this.selectedLogos = this.pickLogos(this.leagueKey);
      this.api.getDashboardSummary({ league_key: this.leagueKey }).subscribe((data) => (this.summary = data));
    });
  }


  metricValue(card: MenuCard, data: DashboardSummary): number {
    switch (card.metric) {
      case 'totalMatches':
        return data.totalMatches || 0;
      case 'totalPlayers':
        return data.totalPlayers || 0;
      case 'totalGoalies':
        return data.totalGoalies || 0;
      case 'teams':
        return data.topTeams?.length || 0;
      default:
        return 0;
    }
  }

  private pickLogos(key: string): string[] {
    const index = Math.max(0, this.leagueIndex(key));
    return this.leagueLogoGroups[index] || this.allLogos.slice(0, 4);
  }

  private leagueIndex(key: string): number {
    const normalized = key.toLowerCase();
    if (normalized.includes('femenina')) return 0;
    if (normalized.endsWith('senior-1') || normalized.includes('senior-1')) return 1;
    if (normalized.endsWith('senior-2') || normalized.includes('senior-2')) return 2;
    if (normalized.includes('grupo-1')) return 3;
    if (normalized.includes('grupo-2')) return 4;
    if (normalized.includes('grupo-3')) return 5;
    return 0;
  }

  private humanizeLeagueKey(key: string): string {
    return key
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
