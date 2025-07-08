
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-contact">
          <a *ngIf="contactInfo().email" [href]="'mailto:' + contactInfo().email" class="contact-link">
            <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
            </svg>
            <span [textContent]="contactInfo().email"></span> <!-- NEW: Use textContent binding -->
          </a>
          <a *ngIf="contactInfo().phone" [href]="'tel:' + contactInfo().phone" class="contact-link">
            <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.58.12.35.03.75-.25 1.02L6.62 10.79z"/>
            </svg>
            <span [textContent]="contactInfo().phone"></span> <!-- NEW: Use textContent binding for consistency -->
          </a>
        </div>
        <div class="footer-links">
          <a routerLink="/about">About</a>
          <a routerLink="/projects">Projects</a>
          <a routerLink="/experience">Experience</a> <!-- Ensure this link is present -->
          <a routerLink="/contact">Contact</a>
        </div>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/rahul-mitra-2313aa17b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.533-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.764 7 2.946v6.289z"/>
            </svg>
          </a>
          <a href="https://github.com/rahul-mitra" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.819-.261.819-.58v-2.09c-3.338.724-4.042-1.61-4.042-1.61-.545-1.385-1.328-1.756-1.328-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.49.998.108-.77.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.311.465-2.383 1.235-3.221-.124-.301-.539-1.52.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.399 1.02.0 2.046.133 3.004.4 2.291-1.552 3.297-1.23 3.297-1.23.656 1.656.241 2.875.118 3.176.77.838 1.233 1.911 1.233 3.221 0 4.61-2.808 5.625-5.474 5.922.429.369.816 1.096.816 2.213v3.293c0 .319.217.695.825.578 4.766-1.586 8.203-6.084 8.203-11.383 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
        <p class="copyright">
          © {{ currentYear() }} Made with ❤️ by Rahul Mitra
        </p>
      </div>
    </footer>
  `,
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
  private dataService = inject(DataService);


  contactInfo = toSignal(this.dataService.getContactInfo(), { initialValue: { email: '', phone: '' } });
}
