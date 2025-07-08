
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
    <div class="project-card">
      <img [src]="safeThumbnailUrl()" [alt]="project().title + ' thumbnail'" class="project-thumbnail"
           onerror="this.onerror=null;">
      <div class="card-content">
        <h3 class="project-title">{{ project().title }}</h3>
        <p class="project-description">{{ project().shortDescription }}</p>
        <div class="project-technologies">
          <!-- Outer wrapper for overflow hiding -->
          <div class="technologies-scroll-container">
            <!-- Inner container for the actual scrolling content -->
            <div class="technologies-scroll-content">
              <app-tag-chip *ngFor="let tech of project().technologies" [text]="tech"></app-tag-chip>
              <!-- Duplicate the chips for a seamless looping effect -->
              <app-tag-chip *ngFor="let tech of project().technologies" [text]="tech"></app-tag-chip>
            </div>
          </div>
        </div>
        <div class="project-ownership">
          <span>{{ project().ownership }} Project</span>
        </div>
        <div class="card-actions">
          <app-button [label]="'View Details'" [styleType]="'primary'" [link]="'/projects/' + project().id" [tooltip]="'Click to view project details'"></app-button>
          <app-button *ngIf="project().liveSiteUrl" [label]="'Live Demo'" [styleType]="'secondary'" [link]="$any(project().liveSiteUrl)" [openInNewTab]="true" [disabled]="project().ownership!=='Personal'"
          [tooltip]="project().ownership !== 'Personal' ? 'Live demo available only for personal projects' : 'View the live demo'"></app-button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './project-card.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  project = input.required<Project>();
  private sanitizer = inject(DomSanitizer);


  safeThumbnailUrl(): SafeUrl {
    const imageUrl = this.project().thumbnail;
    // console.log('Attempting to load image:', imageUrl); // DEBUGGING LINE
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
}
