'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/lib/hooks/useAuth';
import { User as UserIcon, Mail, Save } from 'lucide-react';

export default function UserProfilePage() {
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    countryOfOrigin: '',
    volunteeringExperience: '',
    jobTitle: '',
    organisation: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });

  useEffect(() => {
    if (user && firebaseUser) {
      fetchProfile();
    }
  }, [user, firebaseUser]);

  const fetchProfile = async () => {
    if (!firebaseUser) return;

    setLoadingProfile(true);
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      const profile = data.profile;

      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        countryOfOrigin: profile.countryOfOrigin || '',
        volunteeringExperience: profile.volunteeringExperience || '',
        jobTitle: profile.jobTitle || '',
        organisation: profile.organisation || '',
        phone: profile.phone || '',
        emergencyContactName: profile.emergencyContact?.name || '',
        emergencyContactPhone: profile.emergencyContact?.phone || '',
        emergencyContactRelationship: profile.emergencyContact?.relationship || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firebaseUser) {
      setError('You must be logged in to update your profile');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = await firebaseUser.getIdToken();

      // Prepare update payload
      const updatePayload: any = {
        displayName: formData.displayName,
        countryOfOrigin: formData.countryOfOrigin,
        volunteeringExperience: formData.volunteeringExperience,
        jobTitle: formData.jobTitle,
        organisation: formData.organisation,
        phone: formData.phone,
      };

      // Add emergency contact if any field is filled
      if (
        formData.emergencyContactName ||
        formData.emergencyContactPhone ||
        formData.emergencyContactRelationship
      ) {
        updatePayload.emergencyContact = {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        };
      } else {
        updatePayload.emergencyContact = null;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <DashboardLayout requiredRole="user">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            My Profile
          </h1>
          <p className="text-text-muted">
            Manage your personal information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="displayName"
                  name="displayName"
                  label="Full Name"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  helperText="Email cannot be changed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="countryOfOrigin"
                  name="countryOfOrigin"
                  label="Country of Origin"
                  value={formData.countryOfOrigin}
                  onChange={handleChange}
                  placeholder="e.g., United Kingdom"
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 20 1234 5678"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />
                <Input
                  id="organisation"
                  name="organisation"
                  label="Organisation/Company"
                  value={formData.organisation}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <Textarea
                id="volunteeringExperience"
                name="volunteeringExperience"
                label="Volunteering Experience"
                value={formData.volunteeringExperience}
                onChange={handleChange}
                placeholder="Tell us about your previous volunteering experience..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                label="Contact Name"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Full name"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  label="Contact Phone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="+44 20 1234 5678"
                />
                <Input
                  id="emergencyContactRelationship"
                  name="emergencyContactRelationship"
                  label="Relationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleChange}
                  placeholder="e.g., Parent, Spouse, Sibling"
                />
              </div>
            </CardContent>
          </Card>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              <p>Profile updated successfully!</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              disabled={loading}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
