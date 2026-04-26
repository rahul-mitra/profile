
import { Component, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ButtonComponent } from '../../shared/components/button/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SocialLink } from '../../shared/models/social-link';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ButtonComponent, ReactiveFormsModule, FormsModule],
  template: `
    <section class="contact-page relative overflow-hidden pb-20 section-padding">
      <div class="glow-sphere"></div>
      
      <div class="container relative z-10 pt-10">
        <app-section-header
          [title]="'Get In Touch'"
          [subtitle]="'Have a project in mind or just want to chat? I\\'m always open to discussing new ideas.'"
        ></app-section-header>

        <div class="contact-grid grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto mt-12">
          
          <!-- Column: Info & Socials -->
          <div class="lg:col-span-12 space-y-8 animate-slide-right text-center">
            <div class="space-y-4 max-w-3xl mx-auto">
              <h3 class="text-4xl md:text-5xl font-bold text-white">Let's <span class="text-gradient">connect</span>.</h3>
              <p class="text-slate-400 text-lg leading-relaxed">
                If you'd like to discuss a project or have a question about RAG LLM or Azure cloud architecture, please feel free to reach out. I'm always happy to connect and explore potential collaborations.
              </p>
            </div>

            <div class="space-y-4">
               <!-- Contact Cards -->
               <div class="glass-panel p-6 flex items-center justify-center gap-6 group hover:border-emerald-500/30 transition-all duration-500 max-w-lg mx-auto">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Email Me</p>
                    <a [href]="'mailto:' + contactEmail()" class="text-white font-semibold text-lg hover:text-emerald-400 transition-colors">{{ contactEmail() }}</a>
                  </div>
               </div>

               <div class="glass-panel p-6 flex items-center justify-center gap-6 group hover:border-emerald-500/30 transition-all duration-500 max-w-lg mx-auto">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Location</p>
                    <p class="text-white font-semibold text-lg">Chhattisgarh, India (Available Worldwide)</p>
                  </div>
               </div>
            </div>

            <!-- Social Links Grid -->
            <div class="space-y-4 pt-4">
              <h4 class="text-sm font-bold uppercase tracking-widest text-slate-500">Connect with me</h4>
              <div class="flex flex-wrap gap-4 justify-center">
                <a *ngFor="let link of socialLinks()" [href]="link.url" target="_blank" rel="noopener noreferrer" 
                   class="glass-panel px-6 py-3 flex items-center gap-3 text-white font-medium hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all group">
                   <span>{{ link.name }}</span>
                   <svg class="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  contactForm = signal(
    this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    })
  );

  contactEmail = toSignal(this.dataService.getContactInfo().pipe(
    map(info => info.email)
  ), { initialValue: 'loading@example.com' });

  socialLinks = toSignal(this.dataService.getSocialLinks(), { initialValue: [] as SocialLink[] });

  onSubmit() {
    const form = this.contactForm();
    if (form.valid) {
      form.reset();
      this.cdr.detectChanges();
    } else {
      form.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }
}
