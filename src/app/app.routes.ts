
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';

import { ProjectsPageComponent } from './modules/projects/pages/projects-page/projects-page';
import { ProjectDetailComponent } from './modules/projects/components/project-detail/project-detail';
import { ContactComponent } from './components/contact/contact';
import { ExperienceComponent } from './components/experience/experience';
import { TestimonialsPageComponent } from './components/testimonials-page/testimonials-page';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsPageComponent },
  // { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  // { path: 'testimonials', component: TestimonialsPageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: '**', redirectTo: '' }
];
