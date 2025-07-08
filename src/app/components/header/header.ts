
import { Component, signal, effect, inject, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../core/services/data/data';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container header-content">
        <a routerLink="/" class="logo" (click)="closeMobileMenu()">
          <span>Rahul Mitra</span>
        </a>
        <nav class="desktop-nav">
          <ul>
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMobileMenu()">Home</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
            <li><a routerLink="/projects" routerLinkActive="active" (click)="closeMobileMenu()">Projects</a></li>
            <li><a routerLink="/experience" routerLinkActive="active" (click)="closeMobileMenu()">Experience</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
            <li *ngIf="cvLink()"><a [href]="cvLink()" routerLinkActive="active" target="_blank">Resume</a></li>
          </ul>
        </nav>
        <button class="menu-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation menu">
          <svg *ngIf="!isMobileMenuOpen()" class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg *ngIf="isMobileMenuOpen()" class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="mobile-nav" [class.open]="isMobileMenuOpen()">
        <ul>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMobileMenu()">Home</a></li>
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
          <li><a routerLink="/projects" routerLinkActive="active" (click)="closeMobileMenu()">Projects</a></li>
          <li><a routerLink="/experience" routerLinkActive="active" (click)="closeMobileMenu()">Experience</a></li>
          <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>
          <li *ngIf="cvLink()"><a [href]="cvLink()" routerLinkActive="active" target="_blank">Resume</a></li>
        </ul>
      </nav>
    </header>
  `,
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private dataService:DataService = inject(DataService);
  cvLink = toSignal(this.dataService.getCvLink(), { initialValue: "" });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.closeMobileMenu();
          }
        });
      });
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(current => !current);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMobileMenuOpen() ? 'hidden' : '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
