import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlayerAnalysisResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-player-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analysis-backdrop" *ngIf="open" (click)="close.emit()">
      <div class="analysis-modal card" (click)="$event.stopPropagation()">
        <button class="analysis-close" type="button" (click)="close.emit()" aria-label="Cerrar modal">×</button>

        <ng-container *ngIf="analysis as item">
          <div class="analysis-header">
            <div>
              <h2>{{ item.nombre }}</h2>
              <p class="muted">{{ item.equipo }}</p>
            </div>
          </div>

          <section class="analysis-section">
            <h3>Análisis</h3>
            <p>{{ item.analisis }}</p>
          </section>

          <section class="analysis-section" *ngIf="item.puntos_mejora?.length">
            <h3>Puntos de mejora</h3>
            <ul>
              <li *ngFor="let punto of item.puntos_mejora">{{ punto }}</li>
            </ul>
          </section>

          <section class="analysis-section" *ngIf="item.ejercicios?.length">
            <h3>Ejercicios recomendados</h3>
            <article class="exercise-card" *ngFor="let ejercicio of item.ejercicios">
              <h4>{{ ejercicio.nombre }}</h4>
              <p><strong>Descripción:</strong> {{ ejercicio.descripcion }}</p>
              <p><strong>Objetivo:</strong> {{ ejercicio.objetivo }}</p>
            </article>
          </section>

          <section class="analysis-section" *ngIf="item.videos?.length">
            <h3>Vídeos</h3>
            <article class="video-card" *ngFor="let video of item.videos; let i = index">
              <button type="button" class="video-toggle" (click)="toggleVideo(i)">
                {{ video.titulo }}
              </button>

              <div class="video-content" *ngIf="openedVideoIndex === i">
                <ng-container *ngIf="getYoutubeEmbedUrl(video.url) as embedUrl; else openLinkOnly">
                  <iframe
                    width="100%"
                    height="315"
                    [src]="embedUrl"
                    title="Video de YouTube"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  ></iframe>
                </ng-container>

                <ng-template #openLinkOnly>
                  <a [href]="video.url" target="_blank" rel="noopener noreferrer">Abrir vídeo en YouTube</a>
                </ng-template>
              </div>
            </article>
          </section>

          <section class="analysis-section" *ngIf="item.conclusion">
            <h3>Conclusión</h3>
            <p>{{ item.conclusion.resumen }}</p>
            <p><strong>Nivel:</strong> {{ item.conclusion.nivel }}</p>
          </section>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .analysis-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 1000;
    }

    .analysis-modal {
      width: min(960px, 100%);
      max-height: 90vh;
      overflow: auto;
      position: relative;
      padding: 24px;
    }

    .analysis-close {
      position: absolute;
      top: 12px;
      right: 12px;
      border: 0;
      background: transparent;
      font-size: 28px;
      cursor: pointer;
      line-height: 1;
    }

    .analysis-header {
      padding-right: 32px;
    }

    .analysis-section {
      margin-top: 24px;
    }

    .muted {
      color: #64748b;
      margin: 0;
    }

    .exercise-card,
    .video-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-top: 12px;
    }

    .video-toggle {
      width: 100%;
      text-align: left;
      border: 0;
      border-radius: 10px;
      padding: 12px 14px;
      font-weight: 700;
      cursor: pointer;
      background: #e2e8f0;
      color: #0f172a;
    }

    .video-content {
      margin-top: 12px;
    }

    iframe {
      border-radius: 12px;
      border: 0;
    }
  `]
})
export class PlayerAnalysisModalComponent {
  @Input() open = false;
  @Input() analysis: PlayerAnalysisResponse | null = null;
  @Output() close = new EventEmitter<void>();

  openedVideoIndex: number | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {}

  toggleVideo(index: number): void {
    this.openedVideoIndex = this.openedVideoIndex === index ? null : index;
  }

  getYoutubeEmbedUrl(url: string): SafeResourceUrl | null {
    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')) {
        const videoId = parsed.searchParams.get('v');
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }

      if (parsed.hostname === 'youtu.be') {
        const videoId = parsed.pathname.replace('/', '');
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }

      return null;
    } catch {
      return null;
    }
  }
}
