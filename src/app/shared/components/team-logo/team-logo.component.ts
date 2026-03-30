import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getTeamBrand, isTeam360 } from '../../../core/utils/team-branding';

@Component({
  selector: 'app-team-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-logo-wrap" [class.team-logo-360]="animate360 && is360Team" [class.team-logo-wrap-large]="size === 'lg'" [attr.title]="resolvedName">
      <img
        *ngIf="logo && !hasImageError; else fallback"
        class="team-logo"
        [class.team-logo-large]="size === 'lg'"
        [src]="logo"
        [alt]="resolvedName"
        loading="lazy"
        decoding="async"
        (error)="handleImageError()"
      />
      <ng-template #fallback>
        <div class="team-logo team-logo-fallback" [class.team-logo-large]="size === 'lg'">
          {{ initials }}
        </div>
      </ng-template>
    </div>
  `
})
export class TeamLogoComponent implements OnChanges {
  @Input() team?: string | null;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() animate360 = false;
  hasImageError = false;

  ngOnChanges(_changes: SimpleChanges): void {
    this.hasImageError = false;
  }

  get brand() {
    return getTeamBrand(this.team);
  }

  get logo(): string | undefined {
    return this.brand?.logo;
  }

  get resolvedName(): string {
    return this.brand?.name || this.team || 'Equipo';
  }

  get initials(): string {
    return this.resolvedName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  get is360Team(): boolean {
    return isTeam360(this.team);
  }

  handleImageError(): void {
    this.hasImageError = true;
  }
}
