

import { Experience } from "./experience";
import { Project } from "./projects";
import { Skill } from "./skill";
import { SocialLink } from "./social-link";
import { Testimonial } from "./testimonial";



export interface PortfolioData {
  aboutMe: {
    intro: string;
    photoUrl: string;
  };
  skills: Skill[];
  projects: Project[];
  testimonials?: Testimonial[];
  socialLinks: SocialLink[];
  contactInfo: {
    email: string;
    phone:string;

  };
  cvLink: string;
  experiences?: Experience[];
}
