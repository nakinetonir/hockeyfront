import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-glow footer-glow-a"></div>
      <div class="footer-glow footer-glow-b"></div>

      <div class="footer-inner">
        <section class="footer-brand-card" aria-label="Información de Hockey Línea Madrid">
          <a class="footer-brand" routerLink="/">
            <span class="footer-mark">HLM</span>
            <span>
              <strong>Hockey Línea</strong>
              <small>Madrid</small>
            </span>
          </a>

          <p>
            Estadísticas, equipos, jugadores, porteros y partidos de las ligas madrileñas
            de hockey línea en un panel visual y filtrado por competición.
          </p>

          <div class="footer-badges">
            <span>Datos por liga</span>
            <span>Partidos</span>
            <span>Rendimiento</span>
          </div>
        </section>

        <nav class="footer-links-card" aria-label="Enlaces principales">
          <h3>Navegación</h3>
          <a routerLink="/">Inicio</a>
          <a routerLink="/">Seleccionar liga</a>
        </nav>

        <nav class="footer-links-card" aria-label="Enlaces de hockey">
          <h3>Links de hockey</h3>
          <a href="https://www.hockeylinea.fmp.es/" target="_blank" rel="noopener noreferrer">
            Federación Madrileña de Patinaje · Hockey Línea
            <span class="external-arrow">↗</span>
          </a>
        </nav>
      </div>

      <div class="footer-bottom">
        <span>© 2026 Hockey Línea Madrid</span>
        <span class="footer-dot"></span>
        <span>Panel no oficial de visualización deportiva</span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      position: relative;
      overflow: hidden;
      margin-top: clamp(34px, 6vw, 76px);
      padding: clamp(34px, 5vw, 64px) 24px 26px;
      border-top: 1px solid rgba(125, 211, 252, 0.18);
      background:
        radial-gradient(circle at 12% 0%, rgba(56, 189, 248, 0.18), transparent 34%),
        radial-gradient(circle at 88% 18%, rgba(34, 197, 94, 0.13), transparent 30%),
        linear-gradient(180deg, rgba(2, 6, 23, 0.28), rgba(2, 6, 23, 0.96) 52%, #020617);
      isolation: isolate;
    }

    .site-footer::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(125,211,252,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(125,211,252,.045) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: linear-gradient(to bottom, transparent, black 18%, black 72%, transparent);
      opacity: .75;
      z-index: -2;
    }

    .footer-glow {
      position: absolute;
      width: 360px;
      height: 360px;
      border-radius: 999px;
      filter: blur(48px);
      opacity: .38;
      pointer-events: none;
      z-index: -1;
    }

    .footer-glow-a {
      left: -120px;
      bottom: -180px;
      background: rgba(56, 189, 248, .36);
    }

    .footer-glow-b {
      right: -140px;
      top: -160px;
      background: rgba(34, 197, 94, .24);
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(260px, 1.45fr) minmax(190px, .75fr) minmax(260px, 1fr);
      gap: 18px;
      align-items: stretch;
    }

    .footer-brand-card,
    .footer-links-card {
      border: 1px solid rgba(125, 211, 252, .18);
      background:
        linear-gradient(145deg, rgba(15, 23, 42, .82), rgba(8, 18, 34, .72)),
        radial-gradient(circle at 100% 0%, rgba(56, 189, 248, .12), transparent 36%);
      border-radius: 28px;
      box-shadow:
        0 22px 70px rgba(2, 6, 23, .32),
        inset 0 1px 0 rgba(255,255,255,.045);
    }

    .footer-brand-card {
      padding: clamp(22px, 3vw, 32px);
    }

    .footer-brand {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      color: #f8fafc;
      text-decoration: none;
    }

    .footer-mark {
      display: inline-grid;
      place-items: center;
      width: 54px;
      height: 54px;
      border-radius: 19px;
      color: #031525;
      font-size: .8rem;
      font-weight: 1000;
      letter-spacing: .08em;
      background: linear-gradient(135deg, #7dd3fc, #22c55e);
      box-shadow: 0 18px 40px rgba(14,165,233,.28);
    }

    .footer-brand strong {
      display: block;
      font-size: clamp(1.15rem, 2vw, 1.45rem);
      letter-spacing: -0.04em;
    }

    .footer-brand small {
      display: block;
      margin-top: 5px;
      color: #38bdf8;
      font-size: .8rem;
      font-weight: 1000;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    .footer-brand-card p {
      max-width: 660px;
      margin: 20px 0 0;
      color: #b9c8dd;
      font-size: .98rem;
      line-height: 1.65;
    }

    .footer-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-top: 22px;
    }

    .footer-badges span {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      color: #bae6fd;
      font-size: .78rem;
      font-weight: 900;
      letter-spacing: .04em;
      background: rgba(56,189,248,.10);
      border: 1px solid rgba(125,211,252,.16);
    }

    .footer-links-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links-card h3 {
      margin: 0 0 8px;
      color: #e0f2fe;
      font-size: .82rem;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    .footer-links-card a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 44px;
      padding: 0 14px;
      border-radius: 15px;
      color: #cbd5e1;
      text-decoration: none;
      font-weight: 850;
      background: rgba(255,255,255,.035);
      border: 1px solid rgba(148,163,184,.10);
      transition: transform .18s ease, color .18s ease, background .18s ease, border-color .18s ease;
    }

    .footer-links-card a:hover {
      transform: translateY(-2px);
      color: #f8fafc;
      background: rgba(56,189,248,.10);
      border-color: rgba(125,211,252,.28);
    }

    .external-arrow {
      color: #38bdf8;
      font-weight: 1000;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 20px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #8da2bb;
      font-size: .82rem;
      text-align: center;
    }

    .footer-dot {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: #38bdf8;
      box-shadow: 0 0 16px rgba(56,189,248,.65);
    }

    @media (max-width: 860px) {
      .site-footer {
        margin-top: 42px;
        padding: 30px 14px 22px;
      }

      .footer-inner {
        grid-template-columns: 1fr;
      }

      .footer-brand-card,
      .footer-links-card {
        border-radius: 24px;
      }

      .footer-links-card {
        padding: 18px;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 6px;
        margin-top: 18px;
      }

      .footer-dot {
        display: none;
      }
    }
  `]
})
export class FooterComponent {}
