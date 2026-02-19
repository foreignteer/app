'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { BlogPost } from '@/lib/types/blog';
import { Loader2, Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import SocialShare from '@/components/blog/SocialShare';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/blog/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found');
        } else {
          throw new Error('Failed to fetch blog post');
        }
        return;
      }

      const data = await response.json();
      setPost(data.blogPost);
    } catch (err: any) {
      console.error('Error fetching post:', err);
      setError('Failed to load blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#21B3B1] animate-spin" />
        <span className="ml-3 text-[#7A7A7A]">Loading blog post...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#4A4A4A] mb-4">
            {error === 'Blog post not found' ? '404' : 'Error'}
          </h1>
          <p className="text-[#7A7A7A] mb-6">{error || 'Something went wrong'}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#21B3B1] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-[#E6EAEA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#21B3B1] hover:text-[#168E8C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-sm border border-[#E6EAEA] p-8 md:p-12">
          {/* Category Badge */}
          {post.category && (
            <span className="inline-block px-3 py-1 bg-[#C9F0EF] text-[#21B3B1] text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A4A4A] mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#7A7A7A] pb-6 mb-8 border-b border-[#E6EAEA]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {post.author.name}
                {post.author.role && ` • ${post.author.role}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Draft'}
              </span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            )}
            {post.views !== undefined && (
              <div className="flex items-center gap-2">
                <span>{post.views} views</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-[#4A4A4A] prose-headings:font-bold
              prose-p:text-[#4A4A4A] prose-p:leading-relaxed
              prose-a:text-[#21B3B1] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#4A4A4A] prose-strong:font-semibold
              prose-ul:text-[#4A4A4A] prose-ol:text-[#4A4A4A]
              prose-li:text-[#4A4A4A]
              prose-blockquote:border-l-[#21B3B1] prose-blockquote:text-[#7A7A7A] prose-blockquote:italic
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#E6EAEA]">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-4 h-4 text-[#7A7A7A]" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#FAF5EC] text-[#7A7A7A] text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div className="mt-8 pt-8 border-t border-[#E6EAEA] flex justify-center">
            <SocialShare
              url={`/blog/${post.slug}`}
              title={post.title}
              description={post.excerpt}
            />
          </div>
        </article>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-[#C9F0EF] to-[#F6C98D] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-[#4A4A4A] mb-6">
            Explore volunteering opportunities and start your journey today.
          </p>
          <Link
            href="/experiences"
            className="inline-block bg-[#21B3B1] hover:bg-[#168E8C] text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Browse Experiences
          </Link>
        </div>
      </div>
    </div>
  );
}
