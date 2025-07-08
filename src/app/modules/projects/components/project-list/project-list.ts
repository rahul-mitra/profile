
import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectCardComponent } from '../project-card/project-card';
import { DataService } from '../../../../core/services/data/data';
import { Project } from '../../../../shared/models/projects';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { NgOptimizedImage } from '@angular/common'
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectCardComponent],
  template: `
    <div class="project-list-container container">



      <div *ngIf="projects().length === 0; else projectGrid" class="no-projects-message text-center">
        <p>No projects to display yet. Check back soon!</p>
      </div>

      <ng-template #projectGrid>
        <div class="project-grid">

          <app-project-card *ngFor="let project of projects()" [project]="project"></app-project-card>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './project-list.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
  private dataService = inject(DataService);



  previewMode = input<boolean>(false);



  projects = input<Project[]>([]);


}
