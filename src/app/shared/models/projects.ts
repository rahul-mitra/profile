

export interface Project {
  id: string;
  title: string;
  category: string[];
  thumbnail: string;
  shortDescription: string;
  technologies: string[];
  liveSiteUrl?: string;
  githubRepoUrl?: string;

  ownership: 'Personal' | 'Organization' | 'Client';
  overview: string;
  role?: string;
  duration?: string;
  problem: string;
  process: string;
  solution: string;
  outcome?: string;
  learnings?: string;
  fullImages?: string[];
  videoUrl?: string;
}
