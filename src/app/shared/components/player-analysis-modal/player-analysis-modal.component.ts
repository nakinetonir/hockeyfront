import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlayerAnalysisResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-player-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-analysis-modal.component.html',
  styleUrl: './player-analysis-modal.component.css',
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
