export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  interests?: string[];
  subscribedAt: Date;
  source: 'footer' | 'volunteer-registration' | 'ngo-registration' | 'newsletter-page';
  marketingConsent: boolean;
  consentGivenAt: Date;
  unsubscribedAt?: Date;
  userId?: string; // Link to user account if subscribed during registration
  status: 'active' | 'unsubscribed';
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: string[];
  source: 'footer' | 'volunteer-registration' | 'ngo-registration' | 'newsletter-page';
  userId?: string;
}
