
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { DataService } from '../../../../core/services/data/data';
import { Project } from '../../../../shared/models/projects';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { TagChipComponent } from '../../../../shared/components/tag-chip/tag-chip';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SectionHeaderComponent, ButtonComponent, TagChipComponent],
  template: `
    <section class="project-detail-page relative min-h-screen overflow-hidden pb-20">
      <div class="glow-sphere"></div>
      
      <div class="container relative z-10 pt-10">
        <div *ngIf="project() === undefined; else projectContent" class="flex flex-col items-center justify-center min-h-[400px]">
          <div *ngIf="!projectNotFound(); else notFound" class="flex flex-col items-center">
             <div class="spinner-large mb-6"></div>
             <p class="text-slate-400 animate-pulse">Fetching project details...</p>
          </div>
          <ng-template #notFound>
            <div class="glass-panel p-12 text-center max-w-lg">
              <h2 class="text-3xl font-bold text-white mb-4">Project Not Found</h2>
              <p class="text-slate-400 mb-8">The project you are looking for does not exist or has been moved.</p>
              <app-button [label]="'Back to Projects'" [styleType]="'primary'" [link]="'/projects'"></app-button>
            </div>
          </ng-template>
        </div>

        <ng-template #projectContent>
          <div *ngIf="project() as projectData" class="space-y-12 md:space-y-20">
            
            <!-- Hero Section -->
            <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div class="w-full lg:w-1/2 space-y-6">
                <div class="inline-block glass-pill px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                   {{ projectData.ownership }} Project
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                  <span class="text-gradient">{{ projectData.title }}</span>
                </h1>
                <div class="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 font-medium border-l-2 border-emerald-500/30 pl-6 py-2">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-500/50">Role:</span> {{ projectData.role || 'Developer' }}
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-500/50">Duration:</span> {{ projectData.duration || 'N/A' }}
                  </div>
                </div>
                <div class="pt-4 flex flex-wrap gap-4">
                  <app-button *ngIf="projectData.liveSiteUrl" [label]="'Live Site'" [styleType]="'primary'" [link]="projectData.liveSiteUrl" [openInNewTab]="true" [disabled]="projectData.ownership !== 'Personal'"></app-button>
                  <app-button *ngIf="projectData.githubRepoUrl" [label]="'View Source'" [styleType]="'secondary'" [link]="projectData.githubRepoUrl" [openInNewTab]="true" [disabled]="projectData.ownership !== 'Personal'"></app-button>
                  <app-button [label]="'All Projects'" [styleType]="'secondary'" [link]="'/projects'"></app-button>
                </div>
              </div>

              <div class="w-full lg:w-1/2 relative group">
                <div class="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-[2rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div class="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl floating-image">
                  <img *ngIf="projectData.fullImages && projectData.fullImages.length > 0; else noFullImg"
                       [src]="safeImageUrl(projectData.fullImages[0])" 
                       [alt]="projectData.title" 
                       class="w-full aspect-[16/10] object-cover"
                       onerror="this.onerror=null;">
                  <ng-template #noFullImg>
                    <img [src]="safeImageUrl(projectData.thumbnail)" [alt]="projectData.title" class="w-full aspect-[16/10] object-cover">
                  </ng-template>
                </div>
              </div>
            </div>

            <!-- Video Section -->
            <div *ngIf="projectData.videoUrl" class="max-w-5xl mx-auto">
              <div class="glass-panel p-2 rounded-[2rem] overflow-hidden shadow-2xl">
                <div class="aspect-video relative rounded-[1.8rem] overflow-hidden bg-slate-950">
                  <iframe [src]="safeVideoUrl(projectData.videoUrl)" class="absolute inset-0 w-full h-full border-0" allowfullscreen></iframe>
                </div>
              </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              
              <div class="glass-panel p-8 md:p-10 space-y-4">
                <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                   <span class="w-8 h-[2px] bg-emerald-500"></span> Overview
                </h3>
                <div class="text-slate-300 leading-relaxed space-y-4" [innerHTML]="safeHtml(projectData.overview)"></div>
              </div>

              <div class="glass-panel p-8 md:p-10 space-y-4 border-emerald-500/10">
                <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                   <span class="w-8 h-[2px] bg-emerald-500"></span> Challenge
                </h3>
                <div class="text-slate-300 leading-relaxed space-y-4" [innerHTML]="safeHtml(projectData.problem)"></div>
              </div>

              <div class="glass-panel p-8 md:p-10 space-y-4 col-span-1 md:col-span-2">
                <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                   <span class="w-8 h-[2px] bg-emerald-500"></span> The Process
                </h3>
                <div class="text-slate-300 leading-relaxed space-y-4" [innerHTML]="safeHtml(projectData.process)"></div>
                
                <div *ngIf="projectData.fullImages && projectData.fullImages.length > 1" 
                     class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                  <div *ngFor="let img of projectData.fullImages.slice(1)" class="group relative overflow-hidden rounded-xl border border-white/5">
                    <img [src]="safeImageUrl(img)" [alt]="projectData.title" 
                         class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-slate-950/20 group-hover:opacity-0 transition-opacity"></div>
                  </div>
                </div>
              </div>

              <div class="glass-panel p-8 md:p-10 space-y-4">
                <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                   <span class="w-8 h-[2px] bg-emerald-500"></span> Solution
                </h3>
                <div class="text-slate-300 leading-relaxed space-y-4" [innerHTML]="safeHtml(projectData.solution)"></div>
                <div *ngIf="projectData.outcome" class="pt-4 border-t border-white/5 mt-6">
                   <p class="text-white font-semibold">Outcome</p>
                   <p class="text-slate-400 mt-1">{{ projectData.outcome }}</p>
                </div>
              </div>

              <div class="glass-panel p-8 md:p-10 space-y-6">
                <div>
                  <h3 class="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                    <span class="w-8 h-[2px] bg-emerald-500"></span> Technologies
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <app-tag-chip *ngFor="let tech of projectData.technologies" [text]="tech"></app-tag-chip>
                  </div>
                </div>

                <div *ngIf="projectData.learnings" class="pt-6 border-t border-white/5">
                   <h3 class="text-xl font-bold text-white mb-3">Key Learnings</h3>
                   <div class="text-slate-400 text-sm leading-relaxed" [innerHTML]="safeHtml(projectData.learnings)"></div>
                </div>
              </div>

            </div>

          </div>
        </ng-template>
      </div>
    </section>
  `,
  styleUrl: './project-detail.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private sanitizer = inject(DomSanitizer);

  project = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.dataService.getProjectById(id) : of(undefined);
      }),
      map(project => {
        if (!project) {
          this.projectNotFound.set(true);
        }
        return project;
      })
    )
  );

  projectNotFound = signal(false);

  safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  safeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  safeVideoUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
