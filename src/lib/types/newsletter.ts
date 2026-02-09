export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  source: 'footer' | 'registration';
  marketingConsent: boolean;
  consentGivenAt: Date;
  unsubscribedAt?: Date;
  userId?: string; // Link to user account if subscribed during registration
  status: 'active' | 'unsubscribed';
}

export interface NewsletterSubscription {
  email: string;
  source: 'footer' | 'registration';
  userId?: string;
}
