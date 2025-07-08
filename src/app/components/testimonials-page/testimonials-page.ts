
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Testimonial } from '../../shared/models/testimonial';

@Component({
  selector: 'app-testimonials-page',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  template: `
    <section class="testimonials-page-section section-padding">
      <div class="container">
        <app-section-header
          [title]="'Kind Words & Collaborations'"
          [subtitle]="'What clients and colleagues say about working with me.'"
        ></app-section-header>

        <div class="testimonials-grid">
          <div *ngIf="testimonials().length === 0; else displayTestimonials" class="no-testimonials-message text-center">
            <p>No testimonials to display yet. Check back soon!</p>
          </div>

          <ng-template #displayTestimonials>
            <div *ngFor="let testimonial of testimonials()" class="testimonial-card">
              <p class="quote">"{{ testimonial.quote }}"</p>
              <p class="author">- {{ testimonial.author }} <span *ngIf="testimonial.company">, {{ testimonial.company }}</span></p>
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `,
  styleUrl: './testimonials-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsPageComponent {
  private dataService = inject(DataService);

  testimonials = toSignal(this.dataService.getTestimonials(), { initialValue: [] });
}
