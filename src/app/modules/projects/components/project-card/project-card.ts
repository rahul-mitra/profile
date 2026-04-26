
import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { TagChipComponent } from '../../../../shared/components/tag-chip/tag-chip';
import { Project } from '../../../../shared/models/projects';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, TagChipComponent],
  template: `
    <div class="group relative flex flex-col md:flex-row w-full overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
         [class.md:flex-row-reverse]="isReversed()">
      
      <!-- Image Section -->
      <div class="relative w-full md:w-3/5 overflow-hidden aspect-video">
        <img [src]="safeThumbnailUrl()" 
             [alt]="project().title + ' thumbnail'" 
             class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
             onerror="this.onerror=null;">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
        
        <div class="absolute top-4 left-4 z-10">
          <div class="glass-pill px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-50">
            {{ project().ownership }}
          </div>
        </div>
      </div>
      
      <!-- Content Section -->
      <div class="relative -mt-8 md:mt-0 flex w-full md:w-2/5 flex-col justify-center p-6 md:p-10 lg:p-12">
        <!-- Glass Background for content -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 md:rounded-r-2xl"
             [class.md:rounded-r-none]="isReversed()"
             [class.md:rounded-l-2xl]="isReversed()"></div>
        
        <div class="relative z-10">
          <h3 class="mb-3 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            <span class="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
              {{ project().title }}
            </span>
          </h3>
          
          <p class="mb-6 text-sm leading-relaxed text-slate-400 md:text-base line-clamp-3 md:line-clamp-4">
            {{ project().shortDescription }}
          </p>
          
          <div class="mb-8 overflow-hidden mask-fade">
             <div class="flex gap-2 animate-scroll">
                <app-tag-chip *ngFor="let tech of project().technologies" [text]="tech"></app-tag-chip>
                <app-tag-chip *ngFor="let tech of project().technologies" [text]="tech"></app-tag-chip>
             </div>
          </div>

          <div class="flex gap-4">
            <app-button class="flex-1" [label]="'Details'" [styleType]="'secondary'" [link]="'/projects/' + project().id"></app-button>
            <app-button *ngIf="project().liveSiteUrl" class="flex-1" [label]="'Live'" [styleType]="'primary'" [link]="$any(project().liveSiteUrl)" [openInNewTab]="true" [disabled]="project().ownership!=='Personal'"></app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  project = input.required<Project>();
  isReversed = input<boolean>(false);
  private sanitizer = inject(DomSanitizer);

  safeThumbnailUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.project().thumbnail);
  }
}
