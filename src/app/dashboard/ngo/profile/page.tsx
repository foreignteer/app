'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { Building2, Save, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

interface NGOData {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  entityType?: string;
  jurisdiction: string;
  serviceLocations: string[];
  website?: string;
  contactEmail: string;
  causes: string[];
  approved: boolean;
  rejectionReason?: string;
  rejectedAt?: Date;
}

const CAUSE_CATEGORIES = [
  'Education',
  'Environment & Sustainability',
  'Community Development',
  'Healthcare',
  'Animal Welfare',
  'Arts & Culture',
  'Human Rights',
  'Poverty Alleviation',
  'Children & Youth',
  'Elderly Care',
  'Disability Support',
  'Women Empowerment',
  'Refugee & Migration Support',
  'Food Security & Nutrition',
  'Water & Sanitation',
  'Climate Action',
  'Sports & Recreation',
  'Mental Health & Wellbeing',
];

const ENTITY_TYPES = [
  'Registered Charity',
  'Non-Profit Organisation',
  'Social Enterprise',
  'Community Interest Company (CIC)',
  'Foundation',
  'Trust',
  'Association',
  'For-Profit with CSR Programme',
  'Other',
];

export default function NGOProfilePage() {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();
  const [ngoData, setNGOData] = useState<NGOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [entityType, setEntityType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [serviceLocations, setServiceLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [otherCause, setOtherCause] = useState('');

  useEffect(() => {
    if (user && firebaseUser) {
      fetchNGOData();
    }
  }, [user, firebaseUser]);

  const fetchNGOData = async () => {
    if (!user || !firebaseUser || !user.ngoId) {
      setError('NGO not found');
      setLoading(false);
      return;
    }

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/ngos/${user.ngoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch NGO data');
      }

      const data = await response.json();
      setNGOData(data.ngo);

      // Populate form fields
      setName(data.ngo.name || '');
      setDescription(data.ngo.description || '');
      setLogoUrl(data.ngo.logoUrl || '');
      setEntityType(data.ngo.entityType || '');
      setJurisdiction(data.ngo.jurisdiction || '');
      setServiceLocations(data.ngo.serviceLocations || []);
      setWebsite(data.ngo.website || '');
      setContactEmail(data.ngo.contactEmail || '');

      // Handle causes including custom "Other:" entries
      const causes = data.ngo.causes || [];
      const standardCauses = causes.filter((c: string) => !c.startsWith('Other:'));
      const otherCauses = causes.find((c: string) => c.startsWith('Other:'));

      setSelectedCauses(standardCauses);
      if (otherCauses) {
        setSelectedCauses([...standardCauses, 'Other']);
        setOtherCause(otherCauses.replace('Other: ', ''));
      }
    } catch (err) {
      console.error('Error fetching NGO data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load NGO data');
    } finally {
      setLoading(false);
    }
  };

  const handleCauseToggle = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
      if (cause === 'Other') {
        setOtherCause('');
      }
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !serviceLocations.includes(newLocation.trim())) {
      setServiceLocations([...serviceLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location: string) => {
    setServiceLocations(serviceLocations.filter((l) => l !== location));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Logo must be an image file');
        return;
      }

      setLogoFile(file);
      setError('');
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoUrl('');
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user?.ngoId) return logoUrl || null;

    setUploadingLogo(true);
    try {
      const fileExtension = logoFile.name.split('.').pop();
      const fileName = `ngo-logos/${user.ngoId}-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, logoFile);
      const downloadURL = await getDownloadURL(storageRef);

      setLogoUrl(downloadURL);
      setLogoFile(null);
      return downloadURL;
    } catch (err) {
      console.error('Error uploading logo:', err);
      throw new Error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validation
      if (!name.trim()) {
        throw new Error('Organisation name is required');
      }
      if (!description.trim()) {
        throw new Error('Description is required');
      }
      if (!jurisdiction.trim()) {
        throw new Error('Jurisdiction is required');
      }
      if (serviceLocations.length === 0) {
        throw new Error('At least one service location is required');
      }
      if (!contactEmail.trim()) {
        throw new Error('Contact email is required');
      }
      if (selectedCauses.length === 0) {
        throw new Error('At least one cause must be selected');
      }
      if (selectedCauses.includes('Other') && !otherCause.trim()) {
        throw new Error('Please specify the other cause category');
      }

      // Prepare causes array
      let finalCauses = [...selectedCauses];
      if (selectedCauses.includes('Other') && otherCause.trim()) {
        const index = finalCauses.indexOf('Other');
        finalCauses[index] = `Other: ${otherCause.trim()}`;
      }

      // Upload logo if there's a new file
      let uploadedLogoUrl = logoUrl;
      if (logoFile) {
        uploadedLogoUrl = await uploadLogo() || logoUrl;
      }

      const token = await firebaseUser!.getIdToken();
      const response = await fetch(`/api/ngos/${user!.ngoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          logoUrl: uploadedLogoUrl || null,
          entityType: entityType || null,
          jurisdiction: jurisdiction.trim(),
          serviceLocations,
          website: website.trim() || null,
          contactEmail: contactEmail.trim(),
          causes: finalCauses,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      await fetchNGOData(); // Refresh data
    } catch (err) {
      console.error('Error saving NGO profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!confirm('Submit your updated profile for admin review? You will receive an email once reviewed.')) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = await firebaseUser!.getIdToken();
      const response = await fetch(`/api/ngos/${user!.ngoId}/resubmit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit for review');
      }

      setSuccess('Profile submitted for review! Admin will be notified.');
      await fetchNGOData();
    } catch (err) {
      console.error('Error submitting for review:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit for review');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="ngo">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ngo">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#4A4A4A] mb-2">NGO Profile</h1>
          <p className="text-[#7A7A7A]">
            Manage your organisation information and settings
          </p>
        </div>

        {/* Rejection Notice */}
        {ngoData?.rejectionReason && (
          <Card>
            <CardContent className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">
                      Your application was not approved
                    </h3>
                    <p className="text-sm text-red-800 mb-3">
                      <strong>Reason:</strong> {ngoData.rejectionReason}
                    </p>
                    <p className="text-sm text-red-700 mb-4">
                      You can update your profile below and submit for review again.
                    </p>
                    <Button
                      onClick={handleSubmitForReview}
                      disabled={saving}
                      isLoading={saving}
                      className="!bg-[#21B3B1] hover:!bg-[#168E8C] !text-white !border-[#21B3B1]"
                    >
                      Submit for Review
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approval Status */}
        {ngoData?.approved && (
          <Card>
            <CardContent className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Profile Approved</h3>
                    <p className="text-sm text-green-700">
                      Your organisation has been approved and is live on the platform
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Organisation Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Organisation Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                placeholder="Your organisation name"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Organisation Logo
              </label>
              <p className="text-sm text-[#7A7A7A] mb-3">
                Upload your logo to be displayed on the Verified Partners page (Max 5MB, Image files only)
              </p>

              {(logoUrl || logoFile) ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={logoFile ? URL.createObjectURL(logoFile) : logoUrl}
                      alt="Organisation logo"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-[#E6EAEA]"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-[#21B3B1] hover:text-[#168E8C]">
                      <Upload className="w-4 h-4" />
                      Change Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#E6EAEA] rounded-lg p-6 text-center hover:border-[#21B3B1] transition-colors">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-[#C9F0EF] rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#21B3B1]" />
                      </div>
                      <span className="text-sm font-medium text-[#4A4A4A]">
                        Click to upload logo
                      </span>
                      <span className="text-xs text-[#7A7A7A]">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                placeholder="Tell us about your organisation and its mission"
              />
            </div>

            {/* Entity Type */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Entity Type *
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
              >
                <option value="">Select entity type...</option>
                {ENTITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-[#7A7A7A]">
                Legal structure of your organisation
              </p>
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Jurisdiction (Country of Registration) *
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                placeholder="e.g., United Kingdom"
              />
            </div>

            {/* Service Locations */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Service Locations *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                  className="flex-1 px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="Add a country or region"
                />
                <Button
                  type="button"
                  onClick={handleAddLocation}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceLocations.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9F0EF] text-[#168E8C] rounded-full text-sm"
                  >
                    {location}
                    <button
                      onClick={() => handleRemoveLocation(location)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                placeholder="https://your-website.org"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                placeholder="contact@your-organisation.org"
              />
            </div>

            {/* Causes */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Cause Categories * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CAUSE_CATEGORIES.map((cause) => (
                  <label
                    key={cause}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCauses.includes(cause)}
                      onChange={() => handleCauseToggle(cause)}
                      className="w-4 h-4 text-[#21B3B1] border-[#E6EAEA] rounded focus:ring-[#21B3B1]"
                    />
                    <span className="text-sm text-[#4A4A4A]">{cause}</span>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCauses.includes('Other')}
                    onChange={() => handleCauseToggle('Other')}
                    className="w-4 h-4 text-[#21B3B1] border-[#E6EAEA] rounded focus:ring-[#21B3B1]"
                  />
                  <span className="text-sm text-[#4A4A4A]">Other</span>
                </label>
              </div>
              {selectedCauses.includes('Other') && (
                <input
                  type="text"
                  value={otherCause}
                  onChange={(e) => setOtherCause(e.target.value)}
                  className="mt-3 w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="Please specify other cause category"
                />
              )}
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                isLoading={saving}
                className="!bg-[#21B3B1] hover:!bg-[#168E8C] !text-white !border-[#21B3B1]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>

              {ngoData?.rejectionReason && (
                <Button
                  onClick={handleSubmitForReview}
                  disabled={saving}
                  isLoading={saving}
                  variant="outline"
                  className="!border-[#21B3B1] !text-[#21B3B1] hover:!bg-[#C9F0EF]"
                >
                  Submit for Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
