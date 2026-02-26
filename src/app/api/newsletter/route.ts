import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { NewsletterSubscriber } from '@/lib/types/newsletter';
import * as brevo from '@getbrevo/brevo';

// Initialize Brevo Contacts API
const contactsApi = new brevo.ContactsApi();
contactsApi.setApiKey(
  brevo.ContactsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

// Brevo List IDs
const BREVO_LISTS = {
  ALL_SUBSCRIBERS: 2,        // Master list - all subscribers (no duplicates)
  NEWSLETTER_PAGE: 5,         // Newsletter page signups
  VOLUNTEER_REGISTRATION: 6,  // Volunteer registrations
  NGO_REGISTRATION: 7,        // NGO registrations
  UNSUBSCRIBED: 3,           // Unsubscribed list
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'footer', userId, name, interests } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Check if already subscribed
    const existingSubscribers = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', emailLower)
      .get();

    if (!existingSubscribers.empty) {
      const existing = existingSubscribers.docs[0].data();

      // If previously unsubscribed, resubscribe
      if (existing.status === 'unsubscribed') {
        await adminDb
          .collection('newsletterSubscribers')
          .doc(existingSubscribers.docs[0].id)
          .update({
            status: 'active',
            subscribedAt: new Date(),
            consentGivenAt: new Date(),
            unsubscribedAt: null,
          });

        // Update contact in Brevo (remove from unsubscribed list)
        try {
          const updateContact = new brevo.UpdateContact();

          // Determine which lists to add to based on source
          const listsToAdd = [BREVO_LISTS.ALL_SUBSCRIBERS];
          if (source === 'newsletter-page') {
            listsToAdd.push(BREVO_LISTS.NEWSLETTER_PAGE);
          } else if (source === 'volunteer-registration') {
            listsToAdd.push(BREVO_LISTS.VOLUNTEER_REGISTRATION);
          } else if (source === 'ngo-registration') {
            listsToAdd.push(BREVO_LISTS.NGO_REGISTRATION);
          }

          updateContact.listIds = listsToAdd;
          updateContact.unlinkListIds = [BREVO_LISTS.UNSUBSCRIBED];
          await contactsApi.updateContact(emailLower, updateContact);
        } catch (brevoErr) {
          console.error('Brevo resubscribe error:', brevoErr);
          // Don't fail the request if Brevo update fails
        }

        return NextResponse.json(
          { success: true, message: 'Resubscribed successfully' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscription
    const now = new Date();
    const subscriber: Omit<NewsletterSubscriber, 'id'> = {
      email: emailLower,
      subscribedAt: now,
      source,
      marketingConsent: true,
      consentGivenAt: now,
      status: 'active',
      ...(userId && { userId }),
      ...(name && { name }),
      ...(interests && interests.length > 0 && { interests }),
    };

    await adminDb.collection('newsletterSubscribers').add(subscriber);

    // Add contact to Brevo
    try {
      const createContact = new brevo.CreateContact();
      createContact.email = emailLower;

      // Determine which lists to add to based on source
      const listsToAdd = [BREVO_LISTS.ALL_SUBSCRIBERS]; // Always add to master list
      if (source === 'newsletter-page') {
        listsToAdd.push(BREVO_LISTS.NEWSLETTER_PAGE);
      } else if (source === 'registration') {
        listsToAdd.push(BREVO_LISTS.VOLUNTEER_REGISTRATION);
      }
      createContact.listIds = listsToAdd;

      // Build attributes object
      const attributes: { [key: string]: string } = {
        SOURCE: source,
        SUBSCRIBED_AT: now.toISOString(),
      };
      if (userId) {
        attributes.USER_ID = userId;
      }
      if (name) {
        createContact.updateEnabled = true;
        // Split name into first and last name for Brevo
        const nameParts = name.trim().split(' ');
        if (nameParts.length > 1) {
          attributes.FIRSTNAME = nameParts[0];
          attributes.LASTNAME = nameParts.slice(1).join(' ');
        } else {
          attributes.FIRSTNAME = name;
        }
      }
      if (interests && interests.length > 0) {
        attributes.INTERESTS = interests.join(', ');
      }
      createContact.attributes = attributes;

      await contactsApi.createContact(createContact);
    } catch (brevoErr: any) {
      console.error('Brevo create contact error:', brevoErr);
      // If contact already exists in Brevo, update instead
      if (brevoErr.status === 400) {
        try {
          const updateContact = new brevo.UpdateContact();

          // Determine which lists to add to based on source
          const listsToAdd = [BREVO_LISTS.ALL_SUBSCRIBERS];
          if (source === 'newsletter-page') {
            listsToAdd.push(BREVO_LISTS.NEWSLETTER_PAGE);
          } else if (source === 'volunteer-registration') {
            listsToAdd.push(BREVO_LISTS.VOLUNTEER_REGISTRATION);
          } else if (source === 'ngo-registration') {
            listsToAdd.push(BREVO_LISTS.NGO_REGISTRATION);
          }

          updateContact.listIds = listsToAdd;
          await contactsApi.updateContact(emailLower, updateContact);
        } catch (updateErr) {
          console.error('Brevo update contact error:', updateErr);
        }
      }
      // Don't fail the request if Brevo fails
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Find subscriber
    const subscribers = await adminDb
      .collection('newsletterSubscribers')
      .where('email', '==', emailLower)
      .get();

    if (subscribers.empty) {
      return NextResponse.json(
        { error: 'Email not found in newsletter' },
        { status: 404 }
      );
    }

    // Unsubscribe
    await adminDb
      .collection('newsletterSubscribers')
      .doc(subscribers.docs[0].id)
      .update({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      });

    // Update contact in Brevo (move to unsubscribed list)
    try {
      const updateContact = new brevo.UpdateContact();
      updateContact.unlinkListIds = [2]; // Remove from newsletter list
      updateContact.listIds = [3]; // Add to unsubscribed list
      await contactsApi.updateContact(emailLower, updateContact);
    } catch (brevoErr) {
      console.error('Brevo unsubscribe error:', brevoErr);
      // Don't fail the request if Brevo update fails
    }

    return NextResponse.json(
      { success: true, message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}
