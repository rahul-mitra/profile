
import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Case 1: No link provided (always a native button) -->
    <ng-container *ngIf="!link(); else linkOrDisabledButton">
      <button
        *ngIf="type() !== 'submit'"
        [type]="type()"
        [class]="'button ' + styleType()"
        (click)="onClick.emit()"
        [disabled]="disabled()"
        [attr.aria-label]="label()"
         [attr.title]="tooltip()"
      >
        {{ label() }}
        <!-- <span *ngIf="tooltip()" class="custom-tooltip">{{ tooltip() }}</span> -->
      </button>

      <button
        *ngIf="type() === 'submit'"
        type="submit"
        [class]="'button ' + styleType()"
        [disabled]="disabled()"
        [attr.aria-label]="label()"
         [attr.title]="tooltip()"
      >
        {{ label() }}
        <!-- <span *ngIf="tooltip()" class="custom-tooltip">{{ tooltip() }}</span> -->
      </button>
    </ng-container>

    <!-- Case 2: Link provided -->
    <ng-template #linkOrDisabledButton>
      <!-- If link is provided AND it's disabled, render as a native button -->
      <button
        *ngIf="disabled()"
        type="button"
        [class]="'button ' + styleType()"
        [disabled]="true"
        [attr.aria-label]="label()"
        [attr.title]="tooltip()"
      >
        {{ label() }}
        <!-- <span *ngIf="tooltip()" class="custom-tooltip">{{ tooltip() }}</span> -->
      </button>

      <!-- If link is provided AND it's NOT disabled, render as an anchor tag -->
      <ng-container *ngIf="!disabled()">
        <!-- Render an anchor tag for EXTERNAL links -->
        <a
          *ngIf="isExternalLink()"
          [href]="link()!"
          [class]="'button ' + styleType()"
          (click)="onClick.emit()"
          [attr.target]="openInNewTab() ? '_blank' : null"
          [attr.rel]="openInNewTab() ? 'noopener noreferrer' : null"
          [attr.aria-label]="label()"
          [attr.title]="tooltip()"
        >
          {{ label() }}
          <!-- <span *ngF="tooltip()" class="custom-tooltip">{{ tooltip() }}</span> -->
        </a>

        <!-- Render an anchor tag for INTERNAL links -->
        <a
          *ngIf="!isExternalLink()"
          [routerLink]="link()!"
          [class]="'button ' + styleType()"
          (click)="onClick.emit()"
          [attr.target]="openInNewTab() ? '_blank' : null"
          [attr.rel]="openInNewTab() ? 'noopener noreferrer' : null"
          [attr.aria-label]="label()"
          [attr.title]="tooltip()"
        >
          {{ label() }}
          <span *ngIf="tooltip()" class="custom-tooltip">{{ tooltip() }}</span>
        </a>
      </ng-container>
    </ng-template>
  `,
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  label = input.required<string>();
  type = input<string>('button');
  tooltip = input<string | undefined>(); // NEW: Input for tooltip text
  styleType = input<'primary' | 'secondary'>('primary');

  link = input<string | undefined>();
  disabled = input<boolean>(false);
  openInNewTab = input<boolean>(false);
  onClick = output<void>();
  // NEW: Method to handle clicks on anchor tags, preventing default if disabled
  handleLinkClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault(); // Prevent default navigation if the button is disabled
      console.log('Disabled link clicked. Default navigation prevented.');
    } else {
      this.onClick.emit(); // Only emit if not disabled
    }
  }
  isExternalLink = computed(() => {
    const currentLink = this.link();
    let comp = currentLink ? currentLink.startsWith('http://') || currentLink.startsWith('https://') : false;
    // console.log('isExternalLink:', comp, 'for link:', currentLink);
    return comp;
  });
  constructor() {


  }
}
