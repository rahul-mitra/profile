// src/app/modules/projects/pages/projects-page/projects-page.ts
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core'; // Added signal, computed
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header';
import { ProjectListComponent } from '../../components/project-list/project-list';
import { DataService } from '../../../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagChipComponent } from '../../../../shared/components/tag-chip/tag-chip'; // Import TagChipComponent

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ProjectListComponent, TagChipComponent], // Added TagChipComponent
  template: `
    <section class="projects-page-section section-padding">
      <div class="container">
        <app-section-header [title]="'My Portfolio'" [subtitle]="'A Collection of My Work'"></app-section-header>

        <div class="category-filters">
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
  `,
  styleUrl: './projects-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {
  private dataService = inject(DataService);

  // Signal to hold all projects fetched from the DataService
  allProjects = toSignal(this.dataService.getProjects(), { initialValue: [] });

  // Signal to hold the currently selected category filter
  selectedCategory = signal<string>('All');

  // Computed signal to derive unique categories from allProjects
  uniqueCategories = computed(() => {
    const categoriesSet = new Set<string>();
    this.allProjects().forEach(project => {
      project.category?.forEach(cat => {
        // console.log('Adding category:', cat);
        categoriesSet.add(cat)
    });
    });
    // Convert set to array and sort alphabetically
    // console.log('Unique categories:',categoriesSet);
    return Array.from(categoriesSet).sort();
  });

  // Computed signal to filter projects based on the selected category
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

  // Method to update the selected category when a filter chip is clicked
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
