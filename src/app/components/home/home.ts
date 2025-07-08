
import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, inject, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
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
    <app-hero
      #heroSection
      class="hero-section"
      [name]="'Rahul Mitra'"
      [title]="'Backend Engineer | UI/UX Designer'"
      [tagline]="'Developer of Systems, Designer of Flow.'"
    ></app-hero>


    <section #aboutPreviewSection class="about-preview section-padding container text-center">
      <h2>About Me</h2>
      <p class="about-text-preview">
        {{ aboutIntro() }}
      </p>
      <app-button [label]="'Learn More About Me'" [styleType]="'primary'" [link]="'/about'"></app-button>
    </section>


    <section #projectsPreviewSection class="projects-preview section-padding container text-center">
      <h2>My Latest Work</h2>

      <p>Explore some of my recent projects where I've turned ideas into reality.</p>
      <app-button [label]="'View All Projects'" [styleType]="'primary'" [link]="'/projects'"></app-button>
    </section>


    <!-- <section #testimonialsPreviewSection class="testimonials-preview section-padding container text-center">
      <h2>What Clients Say</h2>

      <p>Hear from clients and colleagues about our collaborations.</p>
      <app-button [label]="'Read All Testimonials'" [styleType]="'secondary'" [link]="'/testimonials'"></app-button>
    </section> -->
  `,
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('heroSection', { static: false, read: ElementRef }) heroSectionRef: ElementRef | undefined;
  @ViewChild('aboutPreviewSection', { static: false }) aboutPreviewSectionRef: ElementRef | undefined;
  @ViewChild('projectsPreviewSection', { static: false }) projectsPreviewSectionRef: ElementRef | undefined;
  // @ViewChild('testimonialsPreviewSection', { static: false }) testimonialsPreviewSectionRef: ElementRef | undefined;

  private dataService = inject(DataService);
  private observers: IntersectionObserver[] = [];
  private observerSetupAttempted = false;

  aboutIntro = toSignal(this.dataService.getAboutMe().pipe(
    map(about => about.intro.split('. ').slice(0, 2).join('. ') + '.')
  ), { initialValue: 'Loading your story...' });

  constructor() {

    afterNextRender(() => {

      if (!this.observerSetupAttempted && typeof IntersectionObserver !== 'undefined') {
        this.observerSetupAttempted = true;
        // console.log('HomeComponent: afterNextRender called. Attempting to set up Intersection Observers.');

        const refs = [
          { name: 'heroSection', ref: this.heroSectionRef },
          { name: 'aboutPreviewSection', ref: this.aboutPreviewSectionRef },
          { name: 'projectsPreviewSection', ref: this.projectsPreviewSectionRef },
          // { name: 'testimonialsPreviewSection', ref: this.testimonialsPreviewSectionRef }
        ];

        let allRefsAvailable = true;
        refs.forEach(item => {
          if (!item.ref?.nativeElement) {
            allRefsAvailable = false;
            // console.warn(`HomeComponent: afterNextRender: ElementRef or nativeElement for ${item.name} is undefined.`);
          }
        });

        if (allRefsAvailable) {
          // console.log('HomeComponent: afterNextRender: All section refs are available. Setting up observers.');
          refs.forEach(item => {
            if (item.ref?.nativeElement) {
              this.setupIntersectionObserver(item.ref.nativeElement);
            }
          });
        } else {
            // console.warn('HomeComponent: afterNextRender: Not all section refs available yet. Observers not set up this cycle. This might indicate a hydration issue or elements not fully rendered.');
        }
      } else if (!this.observerSetupAttempted && typeof IntersectionObserver === 'undefined') {
         this.observerSetupAttempted = true;
        //  console.warn('HomeComponent: afterNextRender: IntersectionObserver NOT supported. Applying animations immediately as fallback.');
         const fallbackRefs = [
           this.heroSectionRef,
           this.aboutPreviewSectionRef,
           this.projectsPreviewSectionRef,
          //  this.testimonialsPreviewSectionRef
         ];
         fallbackRefs.forEach(ref => {
           if (ref?.nativeElement) {
             ref.nativeElement.classList.add('animate-in');
           }
         });
      }
    });
  }


  ngAfterViewInit(): void {
    // console.log('HomeComponent: ngAfterViewInit called. (Primary observer setup is in afterNextRender)');
  }


  private setupIntersectionObserver(element: HTMLElement): void {
    if (!element) {
      // console.error('HomeComponent: setupIntersectionObserver received an undefined element.');
      return;
    }

    // console.log(`HomeComponent: Setting up observer for element: ${element.tagName} with class ${element.className}`);
    // console.log(`Initial classList for ${element.tagName}:`, element.classList.value);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // console.log(`HomeComponent: Observer callback for ${entry.target.tagName} with class ${entry.target.className}. isIntersecting: ${entry.isIntersecting}, IntersectionRatio: ${entry.intersectionRatio}`);
        // console.log(`Current classList inside callback for ${entry.target.tagName}:`, entry.target.classList.value);

        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // console.log(`HomeComponent: Added 'animate-in' class to ${entry.target.tagName} with class ${entry.target.className}`);

          // console.log(`HomeComponent: Now continuously observing ${entry.target.tagName} for re-entry.`);
        } else {



        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(element);
    this.observers.push(observer);
  }

  ngOnDestroy(): void {
    // console.log('HomeComponent: ngOnDestroy called. Disconnecting observers.');
    this.observers.forEach(observer => observer.disconnect());
  }
}
