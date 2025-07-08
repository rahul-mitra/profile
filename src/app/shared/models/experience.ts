
export interface Experience {
  id: string;
  organization: string;
  location: string;
  role: string;
  duration: string;
  startDate: string;
  endDate?: string;
  descriptionPoints: string[];
  technologiesUsed?: string[];
  logoUrl?: string;
}
