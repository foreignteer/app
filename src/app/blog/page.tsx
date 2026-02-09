'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types/blog';
import { Loader2, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('publishedOnly', 'true');
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/blog?${params.toString()}`);

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

  // Extract unique categories from posts
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#21B3B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Foreignteer Blog</h1>
          <p className="text-xl opacity-90">
            Stories, tips, and insights from the world of volunteering
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-[#E6EAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-[#E6EAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21B3B1] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-[#21B3B1] text-white'
                    : 'bg-white text-[#4A4A4A] border border-[#E6EAEA] hover:border-[#21B3B1]'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as string)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#21B3B1] text-white'
                      : 'bg-white text-[#4A4A4A] border border-[#E6EAEA] hover:border-[#21B3B1]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <div className="text-center py-20">
            <p className="text-xl text-[#7A7A7A] mb-2">No blog posts found</p>
            <p className="text-[#7A7A7A]">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-[#E6EAEA]"
              >
                {/* Featured Image */}
                {post.featuredImage ? (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-[#C9F0EF] to-[#F6C98D] flex items-center justify-center">
                    <span className="text-4xl text-[#21B3B1]">📝</span>
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-[#C9F0EF] text-[#21B3B1] text-xs font-medium rounded-full mb-3">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-[#4A4A4A] mb-3 group-hover:text-[#21B3B1] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-[#7A7A7A] text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-[#7A7A7A]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Draft'}
                        </span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
