
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
    <section class="project-detail-section section-padding container">
      <div *ngIf="project() === undefined; else projectContent" class="loading-state text-center">
        <app-section-header
          [title]="'Loading Project...'"
          [subtitle]="'Please wait while we fetch the details.'"
          *ngIf="!projectNotFound(); else notFoundHeader"
        ></app-section-header>
        <ng-template #notFoundHeader>
          <app-section-header
            [title]="'Project Not Found'"
            [subtitle]="'The project you are looking for does not exist.'"
          ></app-section-header>
          <app-button [label]="'Back to Projects'" [styleType]="'primary'" [link]="'/projects'"></app-button>
        </ng-template>
        <div *ngIf="!projectNotFound()" class="spinner-large"></div>
      </div>

      <ng-template #projectContent>

        <div *ngIf="project() as projectData">
          <app-section-header
            [title]="projectData.title"
            [subtitle]="'Role: ' + (projectData.role || 'N/A') + ' | Duration: ' + (projectData.duration || 'N/A') + (projectData.ownership ? ' | ' + projectData.ownership + ' Project' : '')"
          ></app-section-header>

          <div class="project-content">
            <div *ngIf="projectData.fullImages && projectData.fullImages.length > 0" class="project-hero-image">
              <img [src]="safeImageUrl(projectData.fullImages[0])" [alt]="projectData.title" onerror="this.onerror=null;">

            </div>
            <div *ngIf="projectData.videoUrl" class="project-video-container">
              <iframe [src]="safeVideoUrl(projectData.videoUrl)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>

            <div class="content-block">
              <h3>Project Overview</h3>
              <p [innerHTML]="safeHtml(projectData.overview)"></p>
            </div>

            <div class="content-block">
              <h3>Problem & Challenge</h3>
              <p [innerHTML]="safeHtml(projectData.problem)"></p>
            </div>

            <div class="content-block">
              <h3>My Process</h3>
              <p [innerHTML]="safeHtml(projectData.process)"></p>
              <div *ngIf="projectData.fullImages && projectData.fullImages.length > 1" class="process-images">
                <img *ngFor="let img of projectData.fullImages" [src]="safeImageUrl(img)" [alt]="projectData.title + ' process image'"
                     onerror="this.onerror=null; ">
              </div>
            </div>

            <div class="content-block">
              <h3>Solution & Outcome</h3>
              <p [innerHTML]="safeHtml(projectData.solution)"></p>
              <p *ngIf="projectData.outcome" [innerHTML]="safeHtml('<strong>Outcome:</strong> ' + projectData.outcome)"></p>
            </div>

            <div *ngIf="projectData.learnings" class="content-block">
              <h3>Key Learnings</h3>
              <p [innerHTML]="safeHtml(projectData.learnings)"></p>
            </div>

            <div *ngIf="projectData.technologies && projectData.technologies.length > 0" class="content-block">
              <h3>Technologies Used</h3>
              <div class="tech-tags">
                <app-tag-chip *ngFor="let tech of projectData.technologies" [text]="tech"></app-tag-chip>
              </div>
            </div>

            <div class="project-actions text-center">
              <app-button *ngIf="projectData.liveSiteUrl" [label]="'Visit Live Site'" [styleType]="'primary'" [link]="projectData.liveSiteUrl" [openInNewTab]="true"
              [disabled]="projectData.ownership !== 'Personal'"></app-button>
              <app-button *ngIf="projectData.githubRepoUrl" [label]="'View Code'" [styleType]="'secondary'" [link]="projectData.githubRepoUrl" [openInNewTab]="true"
              [disabled]="projectData.ownership !== 'Personal'"></app-button>
              <app-button [label]="'Back to Projects'" [styleType]="'secondary'" [link]="'/projects'"></app-button>
            </div>
          </div>
        </div>
      </ng-template>
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
    // console.log('Sanitizing image URL:', url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  safeVideoUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
