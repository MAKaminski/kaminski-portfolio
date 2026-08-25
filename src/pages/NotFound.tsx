import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Catch-all route.
 *
 * App.tsx had no `path="*"` entry, so a typo'd URL fell through Vercel's SPA
 * rewrite, returned HTTP 200 with the home page's HTML, and then rendered a
 * blank screen once React mounted and matched no route. Every URL on the site
 * "existed" and none of the missing ones said so.
 */
const NotFound: React.FC = () => (
  <div className="min-h-screen bg-ink-900">
    <Seo
      title="Not found | Michael Kaminski"
      description="That page does not exist."
      canonicalPath="/"
      noindex
    />
    <Header />
    <main className="section-padding flex min-h-[60vh] flex-col items-center justify-center px-4 pt-32 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">404</p>
      <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">That page doesn't exist</h1>
      <p className="mb-8 max-w-lg text-white/60">
        The link may be stale, or the page may have moved. Everything currently published is one of
        these:
      </p>
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold text-accent">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/projects" className="hover:underline">
          Projects
        </Link>
        <Link to="/websites" className="hover:underline">
          Websites
        </Link>
        <Link to="/products" className="hover:underline">
          Products
        </Link>
        <Link to="/writing" className="hover:underline">
          Writing
        </Link>
        <Link to="/clips" className="hover:underline">
          Field clips
        </Link>
        <Link to="/changelog" className="hover:underline">
          Changelog
        </Link>
      </nav>
    </main>
    <Footer />
  </div>
);

export default NotFound;
