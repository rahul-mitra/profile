
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
    <section class="contact-section section-padding container">
      <app-section-header
        [title]="'Get In Touch'"
        [subtitle]="'Have a project in mind or just want to chat? Feel free to reach out!'"
      ></app-section-header>

      <div class="contact-content">
        <!-- <form [formGroup]="contactForm()" (ngSubmit)="onSubmit()" class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" formControlName="name" placeholder="Rahul Mitra">
            <div *ngIf="contactForm().get('name')?.invalid && (contactForm().get('name')?.dirty || contactForm().get('name')?.touched)" class="error-message">
              <span *ngIf="contactForm().get('name')?.errors?.['required']">Name is required.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" placeholder="your@email.com">
            <div *ngIf="contactForm().get('email')?.invalid && (contactForm().get('email')?.dirty || contactForm().get('email')?.touched)" class="error-message">
              <span *ngIf="contactForm().get('email')?.errors?.['required']">Email is required.</span>
              <span *ngIf="contactForm().get('email')?.errors?.['email']">Enter a valid email.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" formControlName="subject" placeholder="Subject of your message">
            <div *ngIf="contactForm().get('subject')?.invalid && (contactForm().get('subject')?.dirty || contactForm().get('subject')?.touched)" class="error-message">
              <span *ngIf="contactForm().get('subject')?.errors?.['required']">Subject is required.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" formControlName="message" rows="6" placeholder="Your message..."></textarea>
            <div *ngIf="contactForm().get('message')?.invalid && (contactForm().get('message')?.dirty || contactForm().get('message')?.touched)" class="error-message">
              <span *ngIf="contactForm().get('message')?.errors?.['required']">Message is required.</span>
            </div>
          </div>

          <div class="text-center">

            <app-button [label]="'Send Message'" [styleType]="'primary'" [type]="'submit'"></app-button>

          </div>
        </form> -->

        <div class="social-links-contact text-center">
          <h3>Find me on:</h3>
          <div class="links-grid">
            <a *ngFor="let link of socialLinks()" [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.name }}</a>
          </div>
          <p class="email-contact" *ngIf="contactEmail()">Or email me directly at: <a [href]="'mailto:' + contactEmail()">{{ contactEmail() }}</a></p>

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
    // console.log('onSubmit called!');
    const form = this.contactForm();

    if (form.valid) {
      // console.log('Form is valid. Submitting!', form.value);












      form.reset();
      this.cdr.detectChanges();
    } else {
      // console.log('Form is invalid. Marking all fields as touched.');
      form.markAllAsTouched();

      this.cdr.detectChanges();
    }
  }
}
