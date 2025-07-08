import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-header text-center">
      <h2>{{ title() }}</h2>
      <p *ngIf="subtitle()" class="subtitle">{{ subtitle() }}</p>
    </div>
  `,
  styleUrl: './section-header.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SectionHeaderComponent {

  title = input.required<string>();


  subtitle = input<string>();
}
