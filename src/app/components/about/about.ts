
import { Component, signal, inject,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagChipComponent } from '../../shared/components/tag-chip/tag-chip';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ButtonComponent } from '../../shared/components/button/button';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Skill } from '../../shared/models/skill';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TagChipComponent, SectionHeaderComponent, ButtonComponent],
  template: `
    <section class="about-section section-padding container">
      <app-section-header [title]="'About Me'" [subtitle]="'A Bit More About My Journey & Skills'"></app-section-header>

      <div class="about-content">
        <div class="profile-intro">

          <img [src]="aboutPhotoUrl()" alt="Rahul Mitra - Profile" class="profile-photo">

          <p class="intro-text" [innerHTML]="aboutIntro()"></p>
        </div>

        <div class="skills-section">
          <h3>My Expertise</h3>
          <div class="skill-categories">
            <div *ngFor="let category of skillCategories()" class="skill-category">
              <h4>{{ category.name }}</h4>
              <div class="skill-chips">

                <app-tag-chip *ngFor="let skill of getSkillsByCategory(category.id)" [text]="skill.name"></app-tag-chip>
              </div>
            </div>
          </div>
        </div>

        <div class="call-to-action text-center">
          <h3>Ready to work together?</h3>
          <app-button [label]="'Get in Touch'" [styleType]="'primary'" [link]="'/contact'"></app-button>
        </div>
      </div>
    </section>
  `,
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  private dataService = inject(DataService);


  aboutIntro = toSignal(this.dataService.getAboutMe().pipe(
    map(about => about.intro)
  ), { initialValue: 'Loading your story...' });


  aboutPhotoUrl = toSignal(this.dataService.getAboutMe().pipe(
    map(about => about.photoUrl)
  ), { initialValue: 'https://placehold.co/200x200/CCCCCC/FFFFFF?text=Photo' });


  skills = toSignal(this.dataService.getSkills(), { initialValue: [] });


  skillCategories = signal([
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'tools', name: 'Tools & Platforms' },
    { id: 'methodologies', name: 'Methodologies & UX' },
  ]);


  getSkillsByCategory(categoryId: string): Skill[] {
    return this.skills().filter(skill => skill.category === categoryId);
  }
}
