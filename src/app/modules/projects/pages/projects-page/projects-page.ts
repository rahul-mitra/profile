
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';
import { ProjectListComponent } from '../../components/project-list/project-list';
import { DataService } from '../../../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagChipComponent } from '../../../../shared/components/tag-chip/tag-chip';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ProjectListComponent, TagChipComponent],
  template: `
    <div class="projects-page">
      <section class="section-padding">
        <div class="container relative-z">
          <app-section-header [title]="'My Portfolio'" [subtitle]="'A Collection of My Work'"></app-section-header>

          <div class="category-filters glass-panel">
            <app-tag-chip
              [text]="'All'"
              (click)="selectCategory('All')"
              [class.active]="selectedCategory() === 'All'"
            ></app-tag-chip>
            <app-tag-chip
              *ngFor="let category of uniqueCategories()"
              [text]="category"
              (click)="selectCategory(category)"
              [class.active]="selectedCategory() === category"
            ></app-tag-chip>
          </div>

          <app-project-list [projects]="filteredProjects()"></app-project-list>
        </div>
      </section>
    </div>
  `,
  styleUrl: './projects-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {
  private dataService = inject(DataService);

  allProjects = toSignal(this.dataService.getProjects(), { initialValue: [] });
  selectedCategory = signal<string>('All');

  uniqueCategories = computed(() => {
    const categoriesSet = new Set<string>();
    this.allProjects().forEach(project => {
      project.category?.forEach(cat => categoriesSet.add(cat));
    });
    return Array.from(categoriesSet).sort();
  });

  filteredProjects = computed(() => {
    const currentCategory = this.selectedCategory();
    const projects = this.allProjects();

    if (currentCategory === 'All') {
      return projects;
    } else {
      return projects.filter(project =>
        project.category?.includes(currentCategory)
      );
    }
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
