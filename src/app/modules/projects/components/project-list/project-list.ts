
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectCardComponent } from '../project-card/project-card';
import { Project } from '../../../../shared/models/projects';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectCardComponent],
  template: `
    <div class="project-list-container">
      <div *ngIf="projects().length === 0; else projectList" class="no-projects-message text-center">
        <p>No projects to display yet. Check back soon!</p>
      </div>

      <ng-template #projectList>
        <div class="flex flex-col gap-12 md:gap-24">
          <app-project-card 
            *ngFor="let project of projects(); let i = index" 
            [project]="project"
            [isReversed]="i % 2 !== 0"
          ></app-project-card>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './project-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
  projects = input<Project[]>([]);
}
