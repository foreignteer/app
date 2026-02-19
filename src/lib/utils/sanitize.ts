import sanitizeHtml from 'sanitize-html';

// Allowlist of safe HTML tags and attributes for rich text content
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a',
    'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
  ],
  allowedAttributes: {
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  // Force external links to be safe
  transformTags: {
    'a': (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer',
        // Only allow http/https links
        href: attribs.href?.startsWith('http') || attribs.href?.startsWith('mailto:')
          ? attribs.href
          : '#',
      },
    }),
  },
};

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Use this before rendering any HTML with dangerouslySetInnerHTML.
 */
export function sanitizeContent(html: string): string {
  if (!html) return '';
  return sanitizeHtml(html, RICH_TEXT_OPTIONS);
}
