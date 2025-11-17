export interface Lead {
  businessName: string;
  industry: string;
  location: string;
  contact: string;
  reason: string;
}

export interface Strategy {
  title: string;
  description: string;
}

export interface SocialGroup {
  name: string;
  platform: 'Facebook' | 'LinkedIn';
  description: string;
  link?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  strategies: Strategy[];
}
