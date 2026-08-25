import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.michael-kaminski.io';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/cfo". Defaults to "/". */
  canonicalPath?: string;
  /** Absolute URL or site-relative path for the social share image. */
  image?: string;
  /** Open Graph type. Defaults to "website". */
  type?: string;
  /** Optional JSON-LD object(s) injected as structured data for this route. */
  jsonLd?: object | object[];
  /** When set, emits a Home > {breadcrumbName} BreadcrumbList for this route. */
  breadcrumbName?: string;
  /**
   * Keep this route out of the index. Used by the role pages (a recruiter lens
   * on one body of work, not a second positioning — left indexable they compete
   * with "/" for what this person does) and by not-found states.
   */
  noindex?: boolean;
}

/**
 * Per-route SEO tags. Renders a unique <title>, meta description, canonical,
 * Open Graph, and Twitter tags so each route is indexed distinctly (the SPA
 * shell in public/index.html only provides the home-page defaults).
 */
const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonicalPath = '/',
  image,
  type = 'website',
  jsonLd,
  breadcrumbName,
  noindex = false,
}) => {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const resolvedImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : DEFAULT_IMAGE;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  if (breadcrumbName) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: breadcrumbName, item: canonical },
      ],
    });
  }

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={resolvedImage} />

      {blocks.map((block, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
