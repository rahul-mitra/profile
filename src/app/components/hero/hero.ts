
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section class="hero-section section-padding">
      <div class="glow-sphere"></div>
      <div class="container hero-content">
        <h1 class="hero-name">
          <span class="text-gradient">{{ name() }}</span>
        </h1>
        <h2 class="hero-title">{{ title() }}</h2>
        <p class="hero-tagline">{{ tagline() }}</p>
        <div class="hero-actions">
          <app-button [label]="'View My Work'" [styleType]="'primary'" [link]="'/projects'"></app-button>
          <app-button label="Let's Connect" [styleType]="'secondary'" [link]="'/contact'"></app-button>
        </div>
      </div>
      
      <!-- Floating Glass Elements for "Alive" feel -->
      <div class="floating-glass glass-1"></div>
      <div class="floating-glass glass-2"></div>
    </section>
  `,
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  name = input.required<string>();
  title = input.required<string>();
  tagline = input.required<string>();
}
