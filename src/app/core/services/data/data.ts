
import { Injectable, inject, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError, shareReplay, map } from 'rxjs/operators';


import { Project } from '../../../shared/models/projects';
import {  Skill } from '../../../shared/models/skill';
import { Testimonial,  } from '../../../shared/models/testimonial';
import { SocialLink,  } from '../../../shared/models/social-link';
import { PortfolioData } from '../../../shared/models/portfolio-data';
import { Experience } from '../../../shared/models/experience';


const PORTFOLIO_DATA_KEY = makeStateKey<PortfolioData>('portfolioData');

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private dataUrl = '/assets/data/portfolio.json';


  private _portfolioData$: Observable<PortfolioData>;

  constructor() {

    const isBrowser = isPlatformBrowser(this.platformId);

    const hasTransferState = this.transferState.hasKey(PORTFOLIO_DATA_KEY);


    if (isBrowser && hasTransferState) {

      const transferredData = this.transferState.get(PORTFOLIO_DATA_KEY, {} as PortfolioData);
      this.transferState.remove(PORTFOLIO_DATA_KEY);
      // console.log('CLIENT (DataService Init): Rehydrating portfolio data from TransferState.', transferredData);
      this._portfolioData$ = of(transferredData);
    } else {


      if (isBrowser) {
        console.warn('CLIENT (DataService Init): TransferState key NOT found. Fetching via HTTP.');
      } else {
        console.log('SERVER (DataService Init): Fetching portfolio data for SSR.');
      }

      this._portfolioData$ = this.http.get<PortfolioData>(this.dataUrl).pipe(
        tap(data => {
          if (isPlatformServer(this.platformId)) {

            this.transferState.set(PORTFOLIO_DATA_KEY, data);
            // console.log('SERVER (DataService Init): Stored portfolio data in TransferState.', data);
          } else {

            // console.log('CLIENT (DataService Init): Fetched portfolio data via HTTP (no TransferState).', data);
          }
        }),
        catchError(error => {
          console.error('DataService: Error fetching portfolio data:', error);

          return of({
            aboutMe: { intro: 'Error loading data.', photoUrl: '' },
            skills: [],
            projects: [],
            socialLinks: [],
            contactInfo: { email: '', phone: '' },
            cvLink: ''
          });
        })
      );
    }



    this._portfolioData$ = this._portfolioData$.pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }





  getProjects(): Observable<Project[]> {
    return this._portfolioData$.pipe(
      map(data => data.projects || [])
    );
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this._portfolioData$.pipe(
      map(data => data.projects.find(p => p.id === id))
    );
  }

  getSkills(): Observable<Skill[]> {
    return this._portfolioData$.pipe(
      map(data => data.skills || [])
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this._portfolioData$.pipe(
      map(data => data.testimonials || [])
    );
  }

  getSocialLinks(): Observable<SocialLink[]> {
    return this._portfolioData$.pipe(
      map(data => data.socialLinks || [])
    );
  }

  getAboutMe(): Observable<{ intro: string, photoUrl: string }> {
    return this._portfolioData$.pipe(
      map(data => data.aboutMe)
    );
  }

  getContactInfo(): Observable<{ email: string,phone:string }> {
    return this._portfolioData$.pipe(
      map(data => data.contactInfo)
    );
  }

   getExperiences(): Observable<Experience[]> {
    return this._portfolioData$.pipe(map(data => data.experiences || []));
  }
  getCvLink(): Observable<string> {
    return this._portfolioData$.pipe(
      map(data => data.cvLink || '')
    );
  }
}
