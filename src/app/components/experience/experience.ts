// src/app/components/experience/experience.ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { Experience } from '../../shared/models/experience'; // Import Experience interface
import { TagChipComponent } from '../../shared/components/tag-chip/tag-chip'; // Import TagChipComponent
import { map } from 'rxjs/operators'; // Import map

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, TagChipComponent],
  template: `
    <section class="experience-section section-padding container">
      <app-section-header
        [title]="'Work Experience'"
        [subtitle]="'My Professional Journey & Contributions'"
      ></app-section-header>

      <!-- Loading/No Data State -->
      <div *ngIf="experiences().length === 0; else experienceTimeline" class="loading-state text-center">
        <p>Loading experience data or no experience to display...</p>
        <div class="spinner-large"></div>
      </div>

      <!-- Experience Timeline -->
      <ng-template #experienceTimeline>
        <div class="timeline">
          <div *ngFor="let experience of experiences(); let i = index" class="timeline-item" [class.left]="i % 2 === 0" [class.right]="i % 2 !== 0">

            <div class="timeline-year">
              <span>{{ experience.duration }}</span>
            </div>
            <div class="timeline-content">
              <div class="content-header">
                <img *ngIf="experience.logoUrl" [src]="experience.logoUrl" [alt]="experience.organization + ' logo'" class="organization-logo"
                     onerror="this.onerror=null; this.src='[https://placehold.co/60x60/B0BEC5/424242?text=Org](https://placehold.co/60x60/B0BEC5/424242?text=Org)';">
                <h3>{{ experience.organization }}</h3>
                <span class="location">{{ experience.location }}</span>
              </div>
              <p class="role">{{ experience.role }}</p>
              <ul class="description-points">
                <li *ngFor="let point of experience.descriptionPoints">{{ point }}</li>
              </ul>
              <div *ngIf="experience.technologiesUsed && experience.technologiesUsed.length > 0" class="tech-tags">
                <app-tag-chip *ngFor="let tech of experience.technologiesUsed" [text]="tech"></app-tag-chip>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </section>
  `,
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceComponent {
  private dataService = inject(DataService);

  // Fetch experiences and sort them by start date (descending)
  experiences = toSignal(
    this.dataService.getExperiences().pipe(
      map(experiences =>
        experiences.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateB.getTime() - dateA.getTime(); // Sort descending
        })
      )
    ),
    { initialValue: [] as Experience[] } // Provide initial empty array
  );
}
