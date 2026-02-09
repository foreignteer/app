'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import ImageUpload from '@/components/forms/ImageUpload';
import LocationPicker from '@/components/forms/LocationPicker';
import { useAuth } from '@/lib/hooks/useAuth';
import { Experience } from '@/lib/types/experience';
import { CAUSE_CATEGORIES } from '@/lib/constants/categories';
import { COUNTRIES } from '@/lib/constants/countries';
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type EditScope = 'occurrence' | 'series';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditScopeDialog, setShowEditScopeDialog] = useState(false);
  const [editScope, setEditScope] = useState<EditScope>('occurrence');

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
    endDate: '',
    causeCategories: [] as string[],
    otherCategory: '',
    capacity: 10,
    programmeFee: '',
    recurring: false,
    recurrencePattern: 'weekly' as 'weekly' | 'biweekly' | 'monthly',
    recurrenceEndDate: '',
    approvalType: 'ngo_approval' as 'instant' | 'ngo_approval' | 'admin_vetting',
    requirements: '',
    accessibility: '',
    images: [] as string[],
    status: 'draft' as 'draft' | 'pending_approval' | 'published' | 'cancelled',
  });

  // Fetch the experience on mount
  useEffect(() => {
    if (user && firebaseUser && id) {
      fetchExperience();
    }
  }, [user, firebaseUser, id]);

  const fetchExperience = async () => {
    if (!user || !firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/ngo/experiences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch experience');
      }

      const data = await response.json();
      const exp = data.experience as Experience;

      console.log('Fetched experience data:', exp);

      setExperience(exp);

      // Populate form data with better error handling
      let startDateStr = '';
      let endDateStr = '';
      let recurrenceEndDateStr = '';

      try {
        const startDate = new Date(exp.dates.start);
        const endDate = new Date(exp.dates.end);

        if (isNaN(startDate.getTime())) {
          console.error('Invalid start date:', exp.dates.start);
          throw new Error('Invalid start date');
        }
        if (isNaN(endDate.getTime())) {
          console.error('Invalid end date:', exp.dates.end);
          throw new Error('Invalid end date');
        }

        startDateStr = format(startDate, 'yyyy-MM-dd');
        endDateStr = format(endDate, 'yyyy-MM-dd');

        console.log('Recurrence end date from exp:', exp.recurrenceEndDate, typeof exp.recurrenceEndDate);

        if (exp.recurrenceEndDate && exp.recurrenceEndDate !== null) {
          try {
            const recEndDate = new Date(exp.recurrenceEndDate);
            console.log('Parsed recurrence end date:', recEndDate, 'Valid:', !isNaN(recEndDate.getTime()));
            if (!isNaN(recEndDate.getTime())) {
              recurrenceEndDateStr = format(recEndDate, 'yyyy-MM-dd');
              console.log('Formatted recurrence end date:', recurrenceEndDateStr);
            } else {
              console.warn('Invalid recurrence end date, setting to empty');
            }
          } catch (recErr) {
            console.error('Error parsing recurrence end date:', recErr);
          }
        }
      } catch (dateError) {
        console.error('Date parsing error:', dateError);
        setError('Failed to parse experience dates. Please contact support.');
        return;
      }

      // Determine approval type from the two boolean fields
      let approvalType: 'instant' | 'ngo_approval' | 'admin_vetting' = 'ngo_approval';
      if (exp.instantConfirmation) {
        approvalType = 'instant';
      } else if (exp.requiresAdminApproval) {
        approvalType = 'admin_vetting';
      }

      setFormData({
        title: exp.title || '',
        summary: exp.summary || '',
        description: exp.description || '',
        city: exp.city || '',
        country: exp.country || 'United Kingdom',
        locationAddress: exp.location?.address || '',
        locationLat: exp.location?.lat,
        locationLng: exp.location?.lng,
        startDate: startDateStr,
        endDate: endDateStr,
        causeCategories: exp.causeCategories || [],
        otherCategory: exp.otherCategory || '',
        capacity: exp.capacity || 10,
        programmeFee: exp.programmeFee ? String(exp.programmeFee) : '',
        recurring: exp.recurring || false,
        recurrencePattern: (exp.recurrencePattern as 'weekly' | 'biweekly' | 'monthly') || 'weekly',
        recurrenceEndDate: recurrenceEndDateStr,
        approvalType: approvalType,
        requirements: (exp.requirements || []).join('\n'),
        accessibility: exp.accessibility || '',
        images: exp.images || [],
        status: exp.status || 'draft',
      });

      console.log('Form data set successfully');
    } catch (err) {
      console.error('Error fetching experience:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch experience');
    } finally {
      setFetchLoading(false);
    }
  };

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

    // If this is a recurring event, show the edit scope dialog
    if (experience?.recurringGroupId && !showEditScopeDialog) {
      setShowEditScopeDialog(true);
      return;
    }

    await performUpdate();
  };

  const performUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user || !firebaseUser) {
        throw new Error('You must be logged in to update an experience');
      }

      // Validate categories
      if (formData.causeCategories.length === 0) {
        throw new Error('Please select at least one cause category');
      }

      if (formData.causeCategories.includes('Other') && !formData.otherCategory.trim()) {
        throw new Error('Please specify the other category');
      }

      const token = await firebaseUser.getIdToken();

      // Prepare the data
      const platformServiceFee = 15.0; // Fixed £15 platform fee
      const programmeFee = formData.programmeFee ? Number(formData.programmeFee) : 0;
      const totalFee = platformServiceFee + programmeFee;

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
          start: new Date(`${formData.startDate}T00:00:00`),
          end: new Date(`${formData.endDate}T23:59:59`),
        },
        causeCategories: formData.causeCategories,
        otherCategory: formData.causeCategories.includes('Other') ? formData.otherCategory : null,
        capacity: Number(formData.capacity),
        platformServiceFee,
        programmeFee,
        totalFee,
        recurring: formData.recurring,
        recurrencePattern: formData.recurring ? formData.recurrencePattern : undefined,
        recurrenceEndDate: formData.recurring && formData.recurrenceEndDate
          ? new Date(formData.recurrenceEndDate)
          : undefined,
        instantConfirmation: formData.approvalType === 'instant',
        requiresAdminApproval: formData.approvalType === 'admin_vetting',
        requirements: formData.requirements.split('\n').filter((r) => r.trim()),
        accessibility: formData.accessibility,
        images: formData.images,
        status: formData.status,
        editScope: experience?.recurringGroupId ? editScope : undefined,
        recurringGroupId: experience?.recurringGroupId,
      };

      const response = await fetch(`/api/ngo/experiences/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update experience');
      }

      // Redirect to experiences list
      router.push('/dashboard/ngo/experiences');
    } catch (err) {
      console.error('Error updating experience:', err);
      setError(err instanceof Error ? err.message : 'Failed to update experience');
    } finally {
      setLoading(false);
      setShowEditScopeDialog(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !firebaseUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/ngo/experiences/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete experience');
      }

      // Redirect to experiences list
      router.push('/dashboard/ngo/experiences');
    } catch (err) {
      console.error('Error deleting experience:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete experience');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout requiredRole="ngo">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!experience) {
    return (
      <DashboardLayout requiredRole="ngo">
        <div className="text-center py-12">
          <p className="text-text-muted">Experience not found</p>
          <Link href="/dashboard/ngo/experiences">
            <Button className="mt-4">Back to Experiences</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Edit Experience
            </h1>
            <p className="text-text-muted">
              Update your volunteering opportunity
            </p>
            {experience.recurringGroupId && (
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                <AlertCircle className="w-4 h-4" />
                <span>This is a recurring event</span>
              </div>
            )}
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

        {/* Edit Scope Dialog */}
        {showEditScopeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Edit Recurring Event
              </h3>
              <p className="text-text-muted mb-6">
                This is a recurring event. Do you want to edit just this occurrence or the entire series?
              </p>

              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="editScope"
                    value="occurrence"
                    checked={editScope === 'occurrence'}
                    onChange={() => setEditScope('occurrence')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-text-primary">This occurrence only</div>
                    <div className="text-sm text-text-muted">
                      Changes will apply only to this specific event on {format(new Date(experience.dates.start), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="editScope"
                    value="series"
                    checked={editScope === 'series'}
                    onChange={() => setEditScope('series')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-text-primary">All events in the series</div>
                    <div className="text-sm text-text-muted">
                      Changes will apply to all recurring events in this series
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowEditScopeDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={performUpdate}
                  isLoading={loading}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </div>
            </div>
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
                label="Experience Title *"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Beach Cleanup & Marine Conservation"
              />

              <Textarea
                id="summary"
                name="summary"
                label="Short Summary *"
                value={formData.summary}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Brief one-line description (max 150 characters)"
                helperText={`${formData.summary.length}/150 characters`}
              />

              <Textarea
                id="description"
                name="description"
                label="Full Description *"
                value={formData.description}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Detailed description of the experience, what volunteers will do, what's included, etc."
              />

              {/* Cause Categories - Multi-select */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Cause Categories * <span className="text-text-muted font-normal">(Select all that apply)</span>
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

                {/* Other Category Field */}
                {formData.causeCategories.includes('Other') && (
                  <Input
                    id="otherCategory"
                    name="otherCategory"
                    label="Please specify the other category *"
                    value={formData.otherCategory}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Music Therapy"
                    className="mt-3"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  label="Capacity (Maximum Volunteers) *"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                />

                <Input
                  id="programmeFee"
                  name="programmeFee"
                  type="number"
                  step="0.50"
                  label="Programme Fee (£)"
                  value={formData.programmeFee}
                  onChange={handleChange}
                  placeholder="0.00"
                  helperText="Optional fee (subject to admin approval). Platform fee: £15.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
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
                  label="City *"
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
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  label="Start Date *"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min="2020-01-01"
                  max="2099-12-31"
                />

                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  label="End Date *"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min="2020-01-01"
                  max="2099-12-31"
                />
              </div>

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
                    Recurring Event Settings
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Repeat Pattern *
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
                      helperText="Last date to create recurring events"
                      min={formData.startDate}
                      max="2099-12-31"
                    />
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

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Experience Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                maxImages={5}
              />
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div>
              {!showDeleteConfirm ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Experience
                </Button>
              ) : (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-text-muted">Are you sure?</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
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
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
