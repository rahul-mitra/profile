import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="tag-chip">
      {{ text() }}
    </span>
  `,
  styleUrl: './tag-chip.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TagChipComponent {

  text = input.required<string>();
}
