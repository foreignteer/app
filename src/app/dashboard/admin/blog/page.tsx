'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { BlogPost, BlogPostFormData } from '@/lib/types/blog';
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function AdminBlogPage() {
  const { firebaseUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: [],
    published: false,
  });

  const [tagInput, setTagInput] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all posts including unpublished
      const response = await fetch('/api/blog?publishedOnly=false');

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      category: '',
      tags: [],
      published: false,
    });
    setTagInput('');
    setShowEditor(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage || '',
      category: post.category || '',
      tags: post.tags || [],
      published: post.published,
    });
    setTagInput('');
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      category: '',
      tags: [],
      published: false,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    // Auto-generate slug if creating new post
    if (!editingPost) {
      setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag),
    });
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText =
      formData.content.substring(0, start) +
      before +
      selectedText +
      after +
      formData.content.substring(end);

    setFormData({ ...formData, content: newText });

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleSave = async () => {
    if (!firebaseUser) {
      alert('You must be logged in');
      return;
    }

    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
      alert('Please fill in all required fields: Title, Slug, Content, and Excerpt');
      return;
    }

    setSaving(true);

    try {
      const token = await firebaseUser.getIdToken();
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PATCH' : 'POST';

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
        throw new Error(data.error || 'Failed to save blog post');
      }

      await fetchPosts();
      setShowEditor(false);
      setEditingPost(null);
      alert(`Blog post ${editingPost ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      alert(err.message || 'Error saving blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    if (!firebaseUser) return;

    setDeleting(postId);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog post');
      }

      await fetchPosts();
      alert('Blog post deleted successfully');
    } catch (err: any) {
      alert(err.message || 'Error deleting blog post');
    } finally {
      setDeleting(null);
    }
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-[#E6EAEA] p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#4A4A4A]">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <Button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 !text-white">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="Enter blog post title..."
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-[#7A7A7A] mt-1">
                  URL-friendly identifier (auto-generated from title)
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="Short summary for blog listing page..."
                />
              </div>

              {/* Content - WYSIWYG */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your blog post content..."
                />
                <p className="text-xs text-[#7A7A7A] mt-1">
                  Use the visual editor to format your content
                </p>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                  placeholder="e.g., Volunteering Tips, Impact Stories, Travel Guides"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1]"
                    placeholder="Add a tag and press Enter"
                  />
                  <Button onClick={handleAddTag} type="button">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9F0EF] text-[#21B3B1] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[#168E8C]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Published */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-[#21B3B1] border-gray-300 rounded focus:ring-[#21B3B1]"
                />
                <label htmlFor="published" className="text-sm font-medium text-[#4A4A4A]">
                  Publish immediately
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
                      {editingPost ? 'Update' : 'Create'} Post
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
          <h1 className="text-3xl font-bold text-[#4A4A4A]">Blog Management</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
            <span className="ml-3 text-[#7A7A7A]">Loading blog posts...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-[#E6EAEA]">
            <p className="text-xl text-[#7A7A7A] mb-4">No blog posts yet</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#E6EAEA]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#E6EAEA]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7A7A7A] uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7A7A7A] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7A7A7A] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7A7A7A] uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7A7A7A] uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#7A7A7A] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EAEA]">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#4A4A4A]">{post.title}</div>
                        <div className="text-xs text-[#7A7A7A]">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#7A7A7A]">
                        {post.category || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#7A7A7A]">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#7A7A7A]">
                        {post.views || 0}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-[#21B3B1] hover:text-[#168E8C]"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === post.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
