
import { Component, OnDestroy, ViewChild, ElementRef, inject, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { HeroComponent } from '../hero/hero';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, ButtonComponent],
  template: `
    <div class="home-page">
      <app-hero
        #heroSection
        [name]="'Rahul Mitra'"
        [title]="'Backend Engineer | UI/UX Designer'"
        [tagline]="'Developer of Systems, Designer of Flow.'"
      ></app-hero>

      <section #aboutPreviewSection class="about-preview section-padding">
        <div class="container">
          <div class="glass-panel text-center">
            <h2 class="text-gradient">About Me</h2>
            <p class="about-text-preview">
              {{ aboutIntro() }}
            </p>
            <app-button [label]="'Learn More About Me'" [styleType]="'primary'" [link]="'/about'"></app-button>
          </div>
        </div>
      </section>

      <section #projectsPreviewSection class="projects-preview section-padding">
        <div class="container">
          <div class="glass-panel text-center">
            <h2 class="text-gradient">My Latest Work</h2>
            <p>Explore some of my recent projects where I've turned ideas into reality.</p>
            <app-button [label]="'View All Projects'" [styleType]="'primary'" [link]="'/projects'"></app-button>
          </div>
        </div>
      </section>
    </div>
  `,

  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {

  @ViewChild('aboutPreviewSection', { static: false }) aboutPreviewSectionRef: ElementRef | undefined;
  @ViewChild('projectsPreviewSection', { static: false }) projectsPreviewSectionRef: ElementRef | undefined;

  private dataService = inject(DataService);
  private observers: IntersectionObserver[] = [];

  aboutIntro = toSignal(this.dataService.getAboutMe().pipe(
    map(about => about.intro.split('. ').slice(0, 2).join('. ') + '.')
  ), { initialValue: 'Loading your story...' });

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver !== 'undefined') {
        const refs = [
          this.aboutPreviewSectionRef,
          this.projectsPreviewSectionRef,
        ];

        refs.forEach(ref => {
          if (ref?.nativeElement) {
            this.setupIntersectionObserver(ref.nativeElement);
          }
        });
      } else {
         // Fallback: Apply immediately if IntersectionObserver is not available
         [this.aboutPreviewSectionRef, this.projectsPreviewSectionRef].forEach(ref => {
           ref?.nativeElement.classList.add('animate-in');
         });
      }
    });
  }

  private setupIntersectionObserver(element: HTMLElement): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(element);
    this.observers.push(observer);
  }

  ngOnDestroy(): void {
    this.observers.forEach(observer => observer.disconnect());
  }
}
