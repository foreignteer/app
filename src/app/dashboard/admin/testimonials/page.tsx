'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Testimonial, TestimonialFormData } from '@/lib/types/testimonial';
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, GripVertical, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function AdminTestimonialsPage() {
  const { firebaseUser } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    role: '',
    organization: '',
    content: '',
    image: '',
    location: '',
    experienceTitle: '',
    rating: 5,
    isPublished: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all testimonials including unpublished
      const response = await fetch('/api/testimonials?publishedOnly=false');

      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      setTestimonials(data.testimonials);
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      organization: '',
      content: '',
      image: '',
      location: '',
      experienceTitle: '',
      rating: 5,
      isPublished: false,
    });
    setShowEditor(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      organization: testimonial.organization || '',
      content: testimonial.content,
      image: testimonial.image || '',
      location: testimonial.location || '',
      experienceTitle: testimonial.experienceTitle || '',
      rating: testimonial.rating || 5,
      isPublished: testimonial.isPublished,
    });
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      organization: '',
      content: '',
      image: '',
      location: '',
      experienceTitle: '',
      rating: 5,
      isPublished: false,
    });
  };

  const handleSave = async () => {
    if (!firebaseUser) {
      alert('You must be logged in');
      return;
    }

    if (!formData.name || !formData.content) {
      alert('Please fill in required fields: Name and Content');
      return;
    }

    setSaving(true);

    try {
      const token = await firebaseUser.getIdToken();
      const url = editingTestimonial
        ? `/api/testimonials/${editingTestimonial.id}`
        : '/api/testimonials';
      const method = editingTestimonial ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save testimonial');
      }

      await fetchTestimonials();
      setShowEditor(false);
      setEditingTestimonial(null);
      alert(`Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      alert(err.message || 'Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    if (!firebaseUser) return;

    setDeleting(testimonialId);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete testimonial');
      }

      await fetchTestimonials();
      alert('Testimonial deleted successfully');
    } catch (err: any) {
      alert(err.message || 'Error deleting testimonial');
    } finally {
      setDeleting(null);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTestimonials = [...testimonials];
    const draggedItem = newTestimonials[draggedIndex];

    newTestimonials.splice(draggedIndex, 1);
    newTestimonials.splice(index, 0, draggedItem);

    setTestimonials(newTestimonials);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    setReordering(true);

    try {
      if (!firebaseUser) throw new Error('Not authenticated');

      const token = await firebaseUser.getIdToken();
      const testimonialIds = testimonials.map((t) => t.id);

      const response = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testimonialIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reorder testimonials');
      }

      // Refresh to get updated data
      await fetchTestimonials();
    } catch (err: any) {
      alert(err.message || 'Error reordering testimonials');
      await fetchTestimonials(); // Revert on error
    } finally {
      setDraggedIndex(null);
      setReordering(false);
    }
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-[#E6EAEA] p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#4A4A4A]">
                {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
              </h1>
              <Button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 !text-white">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="Enter name..."
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="e.g., Volunteer, NGO Partner"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="e.g., NGO name or company"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="e.g., London, UK"
                />
              </div>

              {/* Experience Title */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Experience Title
                </label>
                <input
                  type="text"
                  value={formData.experienceTitle}
                  onChange={(e) => setFormData({ ...formData, experienceTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="Which experience did they participate in?"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Testimonial Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write the testimonial..."
                />
                <p className="text-xs text-[#7A7A7A] mt-1">
                  Format the testimonial text using the editor toolbar
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Rating (1-5 stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (formData.rating || 0)
                            ? 'fill-[#F6C98D] text-[#F6C98D]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-[#7A7A7A]">
                    {formData.rating || 0} stars
                  </span>
                </div>
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-[#21B3B1] border-gray-300 rounded focus:ring-[#21B3B1]"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-[#4A4A4A]">
                  Show on website
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingTestimonial ? 'Update' : 'Create'} Testimonial
                    </>
                  )}
                </Button>
                <Button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 !text-white">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#4A4A4A]">Testimonial Management</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">
              Drag and drop to reorder testimonials
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Testimonial
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
            <span className="ml-3 text-[#7A7A7A]">Loading testimonials...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-[#E6EAEA]">
            <p className="text-xl text-[#7A7A7A] mb-4">No testimonials yet</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Testimonial
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {reordering && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving new order...
              </div>
            )}

            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg shadow-sm border border-[#E6EAEA] p-4 cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-50' : 'opacity-100'
                } hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-[#7A7A7A] mt-2">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#4A4A4A]">
                          {testimonial.name}
                        </h3>
                        {testimonial.role && (
                          <p className="text-sm text-[#7A7A7A]">
                            {testimonial.role}
                            {testimonial.organization && ` • ${testimonial.organization}`}
                          </p>
                        )}
                        {testimonial.location && (
                          <p className="text-xs text-[#7A7A7A] mt-1">📍 {testimonial.location}</p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          testimonial.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {testimonial.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-[#4A4A4A] mb-2 line-clamp-2">
                      {testimonial.content}
                    </p>

                    {testimonial.experienceTitle && (
                      <p className="text-xs text-[#7A7A7A] mb-2">
                        Experience: {testimonial.experienceTitle}
                      </p>
                    )}

                    {testimonial.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating!
                                ? 'fill-[#F6C98D] text-[#F6C98D]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
                      <span>Order: {testimonial.displayOrder}</span>
                      <span>•</span>
                      <span>
                        Created: {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-[#21B3B1] hover:text-[#168E8C] p-2"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleting === testimonial.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 p-2"
                      title="Delete"
                    >
                      {deleting === testimonial.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
