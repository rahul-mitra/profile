
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
    <section class="about-page relative overflow-hidden pb-20 section-padding">
      <div class="glow-sphere"></div>
      
      <div class="container relative z-10 pt-10">
        <app-section-header [title]="'About Me'" [subtitle]="'A Bit More About My Journey & Skills'"></app-section-header>

        <div class="about-content max-w-5xl mx-auto space-y-12">
          <!-- Profile Intro -->
          <div class="glass-panel p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div class="relative group">
              <div class="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img [src]="aboutPhotoUrl()" alt="Rahul Mitra - Profile" class="profile-photo relative z-10">
            </div>

            <div class="flex-1 space-y-6">
              <h3 class="text-3xl font-bold text-white">Who I Am</h3>
              <p class="intro-text text-slate-300 leading-relaxed text-lg" [innerHTML]="aboutIntro()"></p>
            </div>
          </div>

          <!-- Skills Grid -->
          <div class="space-y-8">
            <h3 class="text-3xl font-bold text-white text-center">My expertise</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div *ngFor="let category of skillCategories()" class="glass-panel p-8 flex flex-col items-center">
                <h4 class="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                   <span class="w-6 h-[1px] bg-emerald-500/30"></span>
                   {{ category.name }}
                   <span class="w-6 h-[1px] bg-emerald-500/30"></span>
                </h4>
                <div class="flex flex-wrap justify-center gap-2">
                  <app-tag-chip *ngFor="let skill of getSkillsByCategory(category.id)" [text]="skill.name"></app-tag-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="glass-panel p-12 text-center bg-emerald-500/5 border-emerald-500/20">
            <h3 class="text-3xl font-bold text-white mb-4 text-gradient">Ready to work together?</h3>
            <p class="text-slate-400 mb-8 max-w-lg mx-auto">Let's build something exceptional. I'm currently available for new projects and collaborations.</p>
            <app-button [label]="'Get in Touch'" [styleType]="'primary'" [link]="'/contact'"></app-button>
          </div>
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
