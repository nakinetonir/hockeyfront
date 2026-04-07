import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
      width: min(720px, 100%);
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
    }

    .loader-subtitle {
      position: relative;
      z-index: 1;
      margin: 0 0 22px;
      color: #cbd5e1;
      max-width: 58ch;
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
      border: 3px solid rgba(239, 68, 68, 0.92);
      border-bottom-width: 6px;
      border-radius: 8px;
      background: rgba(255,255,255,0.28);
      box-shadow: inset 0 0 0 2px rgba(255,255,255,0.35);
    }

    .goal-left { left: 42px; }
    .goal-right { right: 42px; }

    .goal span {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(148,163,184,0.34) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.34) 1px, transparent 1px);
      background-size: 8px 8px;
      opacity: 0.7;
    }

    .player {
      top: 50%;
      width: 18px;
      height: 18px;
      margin-top: -9px;
      border-radius: 999px;
      background: linear-gradient(180deg, #0f172a, #334155);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
    }

    .player::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 15px;
      width: 6px;
      height: 22px;
      transform: translateX(-50%);
      border-radius: 999px;
      background: #1e293b;
    }

    .stick {
      position: absolute;
      left: 9px;
      top: 22px;
      width: 3px;
      height: 22px;
      background: #92400e;
      transform-origin: top center;
    }

    .stick::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: -2px;
      width: 12px;
      height: 3px;
      border-radius: 3px;
      background: #92400e;
    }

    .player-one {
      left: 16%;
      animation: skateOne 2.8s ease-in-out infinite;
    }

    .player-one .stick { transform: rotate(18deg); }

    .player-two {
      left: 46%;
      animation: skateTwo 2.8s ease-in-out infinite;
      background: linear-gradient(180deg, #1d4ed8, #1e3a8a);
    }

    .player-two .stick { transform: rotate(-12deg); }

    .player-three {
      left: 76%;
      animation: skateThree 2.8s ease-in-out infinite;
      background: linear-gradient(180deg, #16a34a, #166534);
    }

    .player-three .stick { transform: rotate(20deg); }

    .puck {
      left: 17%;
      top: 50%;
      width: 12px;
      height: 12px;
      margin-top: 14px;
      border-radius: 999px;
      background: radial-gradient(circle at 30% 30%, #334155, #020617 70%);
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04), 0 10px 18px rgba(15, 23, 42, 0.25);
      animation: puckMove 2.8s cubic-bezier(.58,.06,.42,.96) infinite;
    }

    .puck-trail {
      left: 18%;
      top: 50%;
      width: 180px;
      height: 4px;
      margin-top: 19px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(56,189,248,0.2), rgba(56,189,248,0));
      filter: blur(1px);
      animation: trailMove 2.8s ease-in-out infinite;
      transform-origin: left center;
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

      .rink-scene {
        height: 200px;
      }

      .loader-steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalysisLoadingOverlayComponent {
  @Input() open = false;
  @Input() title = 'Preparando análisis personalizado';
  @Input() subtitle = 'Estamos consultando el workflow y construyendo recomendaciones con estadísticas, ejercicios y vídeos.';
}
