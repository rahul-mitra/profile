// src/app/components/experience/experience.ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { Experience } from '../../shared/models/experience';
import { TagChipComponent } from '../../shared/components/tag-chip/tag-chip';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, TagChipComponent],
  template: `
    <section class="experience-page relative overflow-hidden pb-20 section-padding">
      <div class="glow-sphere"></div>
      
      <div class="container relative z-10 pt-10">
        <app-section-header
          [title]="'Work Experience'"
          [subtitle]="'My Professional Journey & Contributions'"
        ></app-section-header>

        <!-- Loading/No Data State -->
        <div *ngIf="experiences().length === 0; else experienceTimeline" class="flex flex-col items-center justify-center min-h-[400px]">
          <div class="spinner-large mb-6"></div>
          <p class="text-slate-400 animate-pulse">Loading journey...</p>
        </div>

        <!-- Experience Timeline -->
        <ng-template #experienceTimeline>
          <div class="timeline max-w-5xl mx-auto space-y-12">
            <div *ngFor="let experience of experiences(); let i = index" 
                 class="timeline-item-wrapper group">
              
              <div class="glass-panel p-8 md:p-10 relative">
                <!-- Year/Duration Badge -->
                <div class="absolute -top-4 right-8">
                  <div class="glass-pill px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {{ experience.duration }}
                  </div>
                </div>

                <div class="flex flex-col md:flex-row gap-8 items-start">
                  <div class="relative">
                    <div class="absolute -inset-2 bg-emerald-500/10 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img *ngIf="experience.logoUrl" [src]="experience.logoUrl" [alt]="experience.organization + ' logo'" 
                         class="organization-logo relative z-10 w-16 h-16 rounded-xl object-contain bg-white/5 p-2 border border-white/10"
                         onerror="this.onerror=null;">
                  </div>

                  <div class="flex-1 space-y-4">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 class="text-2xl font-bold text-white">{{ experience.organization }}</h3>
                      <span class="text-slate-500 font-medium text-sm flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {{ experience.location }}
                      </span>
                    </div>
                    
                    <p class="text-emerald-400 font-bold tracking-wide uppercase text-sm">
                      {{ experience.role }}
                    </p>
                    
                    <ul class="space-y-3">
                      <li *ngFor="let point of experience.descriptionPoints" class="flex gap-3 text-slate-300 leading-relaxed">
                        <span class="text-emerald-500 mt-1.5">•</span>
                        <span>{{ point }}</span>
                      </li>
                    </ul>

                    <div *ngIf="experience.technologiesUsed && experience.technologiesUsed.length > 0" class="pt-6 border-t border-white/5">
                      <div class="flex flex-wrap gap-2">
                        <app-tag-chip *ngFor="let tech of experience.technologiesUsed" [text]="tech"></app-tag-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceComponent {
  private dataService = inject(DataService);

  experiences = toSignal(
    this.dataService.getExperiences().pipe(
      map(experiences =>
        experiences.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateB.getTime() - dateA.getTime();
        })
      )
    ),
    { initialValue: [] as Experience[] }
  );
}
