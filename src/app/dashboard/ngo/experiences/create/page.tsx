'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { useAuth } from '@/lib/hooks/useAuth';
import ImageUpload from '@/components/forms/ImageUpload';
import LocationPicker from '@/components/forms/LocationPicker';
import { CAUSE_CATEGORIES } from '@/lib/constants/categories';
import { COUNTRIES } from '@/lib/constants/countries';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateExperiencePage() {
  const router = useRouter();
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    city: '',
    country: 'United Kingdom',
    locationAddress: '',
    locationLat: undefined as number | undefined,
    locationLng: undefined as number | undefined,
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    causeCategories: [] as string[],
    otherCategory: '',
    capacity: 10,
    programmeFee: '',
    recurring: false,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '',
    approvalType: 'ngo_approval' as 'instant' | 'ngo_approval' | 'admin_vetting',
    requirements: '',
    accessibility: '',
    images: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => {
      const newCategories = checked
        ? [...prev.causeCategories, category]
        : prev.causeCategories.filter((c) => c !== category);
      return { ...prev, causeCategories: newCategories };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user || !firebaseUser) {
        throw new Error('You must be logged in to create an experience');
      }

      const token = await firebaseUser.getIdToken();

      // Prepare the data
      const experienceData = {
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        city: formData.city,
        country: formData.country,
        location: {
          address: formData.locationAddress,
          lat: formData.locationLat,
          lng: formData.locationLng,
        },
        dates: {
          start: new Date(`${formData.startDate}T${formData.startTime}`),
          end: new Date(`${formData.endDate}T${formData.endTime}`),
        },
        time: {
          startTime: formData.startTime,
          duration: calculateDuration(formData.startTime, formData.endTime),
        },
        causeCategories: formData.causeCategories,
        otherCategory: formData.causeCategories.includes('Other') ? formData.otherCategory : undefined,
        capacity: Number(formData.capacity),
        programmeFee: formData.programmeFee ? Number(formData.programmeFee) : undefined,
        recurring: formData.recurring,
        recurrencePattern: formData.recurring ? formData.recurrencePattern : undefined,
        recurrenceEndDate: formData.recurring && formData.recurrenceEndDate ? new Date(formData.recurrenceEndDate) : undefined,
        instantConfirmation: formData.approvalType === 'instant',
        requiresAdminApproval: formData.approvalType === 'admin_vetting',
        requirements: formData.requirements.split('\n').filter((r) => r.trim()),
        accessibility: formData.accessibility,
        images: formData.images,
        status: 'draft', // Start as draft
      };

      const response = await fetch('/api/ngo/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create experience');
      }

      // Redirect to experiences list
      router.push('/dashboard/ngo/experiences');
    } catch (err) {
      console.error('Error creating experience:', err);
      setError(err instanceof Error ? err.message : 'Failed to create experience');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return (endMinutes - startMinutes) / 60;
  };

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create New Experience
            </h1>
            <p className="text-text-muted">
              Create a new volunteering opportunity for your organisation
            </p>
          </div>
          <Link href="/dashboard/ngo/experiences">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Experiences
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="title"
                name="title"
                label="Experience Title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Beach Cleanup & Marine Conservation"
              />

              <Textarea
                id="summary"
                name="summary"
                label="Short Summary"
                value={formData.summary}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Brief one-line description (max 150 characters)"
                helperText={`${formData.summary.length}/150 characters`}
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Description *
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Detailed description of the experience, what volunteers will do, what's included, etc."
                />
                <p className="text-sm text-text-muted mt-1">
                  Use the toolbar to format your text with headings, bold, italic, and lists
                </p>
              </div>

              {/* Cause Categories - Multiple Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Cause Categories * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {CAUSE_CATEGORIES.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.causeCategories.includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-text-primary">{category}</span>
                    </label>
                  ))}
                </div>

                {/* Show "Other" text input if "Other" is selected */}
                {formData.causeCategories.includes('Other') && (
                  <Input
                    id="otherCategory"
                    name="otherCategory"
                    label="Please specify other category *"
                    value={formData.otherCategory}
                    onChange={handleChange}
                    required
                    placeholder="Enter custom category"
                  />
                )}

                {formData.causeCategories.length === 0 && (
                  <p className="text-sm text-red-600">Please select at least one category</p>
                )}
              </div>

              <Input
                id="programmeFee"
                name="programmeFee"
                type="number"
                step="0.50"
                label="Programme Fee (£) - Optional"
                value={formData.programmeFee}
                onChange={handleChange}
                placeholder="0.00"
                helperText="Optional fee for your programme (requires admin approval). Platform service fee of £15 applies to all bookings."
              />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="city"
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., London"
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <LocationPicker
                address={formData.locationAddress}
                onAddressChange={(address, lat, lng) => {
                  setFormData((prev) => ({
                    ...prev,
                    locationAddress: address,
                    locationLat: lat,
                    locationLng: lng,
                  }));
                }}
                label="Full Address with Google Maps"
                required
              />
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    label="Start Date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    min="2020-01-01"
                    max="2099-12-31"
                  />
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    label="End Date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    min="2020-01-01"
                    max="2099-12-31"
                  />
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    label="End Time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Input
                id="capacity"
                name="capacity"
                type="number"
                label="Capacity (Maximum Volunteers)"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-text-primary">
                  This is a recurring experience
                </label>
              </div>

              {formData.recurring && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium">
                    Recurring experiences will be automatically created based on your pattern
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Recurrence Pattern *
                      </label>
                      <select
                        name="recurrencePattern"
                        value={formData.recurrencePattern}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="weekly">Weekly (every 7 days)</option>
                        <option value="biweekly">Bi-weekly (every 14 days)</option>
                        <option value="monthly">Monthly (same date each month)</option>
                      </select>
                    </div>

                    <Input
                      id="recurrenceEndDate"
                      name="recurrenceEndDate"
                      type="date"
                      label="Repeat Until *"
                      value={formData.recurrenceEndDate}
                      onChange={handleChange}
                      required
                      helperText="Last date to create recurring instances"
                      min={formData.startDate}
                      max="2099-12-31"
                    />
                  </div>

                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Example:</p>
                    <p>If you select weekly pattern from 14 Feb to 28 Feb, we'll create 3 separate experiences: 14 Feb, 21 Feb, and 28 Feb.</p>
                  </div>
                </div>
              )}

              {/* Approval Type Selection */}
              <div className="border-t pt-4 mt-4">
                <label htmlFor="approvalType" className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Booking Approval Process
                </label>
                <select
                  id="approvalType"
                  name="approvalType"
                  value={formData.approvalType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#21B3B1] focus:border-transparent"
                >
                  <option value="instant">Instant Confirmation - Bookings automatically confirmed</option>
                  <option value="ngo_approval">NGO Approval Required - You review each application (Default)</option>
                  <option value="admin_vetting">Admin + NGO Approval - Platform vetting before your review</option>
                </select>

                {/* Contextual help text based on selection */}
                <div className="mt-2 text-xs text-[#7A7A7A]">
                  {formData.approvalType === 'instant' && (
                    <p>
                      ✅ <strong>Instant Confirmation:</strong> Volunteer bookings are automatically confirmed.
                      Best for high-capacity events or activities with minimal restrictions.
                    </p>
                  )}
                  {formData.approvalType === 'ngo_approval' && (
                    <p>
                      📋 <strong>NGO Approval:</strong> You manually review and approve each application.
                      Recommended for quality control and capacity management.
                    </p>
                  )}
                  {formData.approvalType === 'admin_vetting' && (
                    <p>
                      🔍 <strong>Admin Vetting:</strong> Platform admin reviews applications first, then passes approved ones to you.
                      Use for high-risk activities, special requirements, or sensitive programs. Not visible to volunteers.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="requirements"
                name="requirements"
                label="Requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="One requirement per line&#10;e.g., Must be 18 years or older&#10;Good physical fitness required"
                helperText="List each requirement on a new line"
              />

              <Textarea
                id="accessibility"
                name="accessibility"
                label="Accessibility Information"
                value={formData.accessibility}
                onChange={handleChange}
                rows={3}
                placeholder="Information about wheelchair access, physical requirements, etc."
              />

              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => {
                  setFormData((prev) => ({ ...prev, images }));
                }}
                maxImages={5}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Link href="/dashboard/ngo/experiences">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              disabled={loading}
            >
              <Save className="w-5 h-5 mr-2" />
              Create Experience
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
