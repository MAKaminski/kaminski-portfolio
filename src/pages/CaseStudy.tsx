import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProject } from '../data/projects';

const SITE_URL = 'https://www.michael-kaminski.io';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
    {children}
  </section>
);

const CaseStudy: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-4 text-center text-white">
        <Seo
          title="Not found | Michael Kaminski"
          description="Case study not found."
          canonicalPath="/projects"
          noindex
        />
        <h1 className="mb-4 text-3xl font-bold text-white">Case study not found</h1>
        <Link to="/projects" className="font-semibold text-accent">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: project.title,
    description: project.summary,
    datePublished: project.date,
    about: project.domain,
    // Point at the Person @id declared in public/index.html rather than
    // re-declaring a second, unlinked author entity.
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#person` },
    url: `${SITE_URL}/projects/${project.slug}`,
    inLanguage: 'en',
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <Seo
        title={`${project.title} | Michael Kaminski`}
        description={project.summary}
        canonicalPath={`/projects/${project.slug}`}
        breadcrumbName={project.title}
        jsonLd={jsonLd}
      />
      <Header />

      <main className="section-padding pt-32">
        <article className="mx-auto max-w-3xl px-4">
          <Link
            to="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            <ArrowLeft size={15} /> All projects
          </Link>

          <header className="mb-10">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-accent">
                {project.domain}
              </span>
              <time dateTime={project.date} className="text-[11px] text-white/40">
                {project.date}
              </time>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mb-8 text-lg text-white/70">{project.summary}</p>

            {/* Lead artifact. The audit measured images_count: 0 on every case
                study page and scored Projects accordingly — the work was all
                prose. */}
            {project.image && (
              <figure className="overflow-hidden rounded-rilla border border-white/10 bg-white/[0.03]">
                <img
                  src={project.image}
                  alt={project.imageAlt || project.title}
                  width={920}
                  height={430}
                  className="w-full"
                />
              </figure>
            )}
          </header>

          <Section title="Problem">
            <div
              className="prose-invert space-y-4 text-white/70 [&_a]:text-accent [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: project.problem }}
            />
          </Section>

          <Section title="Constraints">
            <ul className="space-y-3">
              {project.constraints.map((c) => (
                <li key={c} className="border-l-2 border-white/15 pl-4 text-white/70">
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="My role">
            <p className="text-white/70">{project.role}</p>
          </Section>

          <Section title="What shipped">
            <ul className="space-y-3">
              {project.whatShipped.map((w) => (
                <li key={w} className="border-l-2 border-white/15 pl-4 text-white/70">
                  {w}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Outcome">
            <ul className="space-y-4">
              {project.outcome.map((o) => (
                <li key={o.metric} className="border-l-2 border-accent/50 pl-4">
                  <p className="font-semibold text-white">{o.metric}</p>
                  <p className="text-white/60">{o.detail}</p>
                  <a
                    href={o.source}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    {o.sourceLabel} <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          {project.body && (
            <div
              className="mb-10 text-white/70 [&_a]:text-accent [&_em]:text-white/50 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: project.body }}
            />
          )}

          <Section title="Stack">
            <p className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70"
                >
                  {s}
                </span>
              ))}
            </p>
          </Section>

          <Section title="Artifacts">
            <ul className="space-y-2">
              {project.artifacts.map((a) => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
                  >
                    {a.label} <ArrowUpRight size={14} />
                  </a>
                  <span className="ml-2 text-xs uppercase tracking-wide text-white/35">{a.kind}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Deliberately below Artifacts, not inside Outcome. As the headline of
              the Outcome section this read as "no results"; here it reads as what
              it is — a note about what is still to come. */}
          {project.outcomePending && (
            <p className="mb-10 text-sm italic text-white/40">{project.outcomePending}</p>
          )}

          <hr className="my-10 border-white/10" />

          <p className="text-white/70">
            Building something at the agent layer, or trying to get one through a review process?{' '}
            <a href="https://calendly.com/kaminski1337/15min" className="font-semibold text-accent hover:underline">
              Book a call
            </a>{' '}
            or email{' '}
            <a href="mailto:MKaminski1337@gmail.com" className="font-semibold text-accent hover:underline">
              MKaminski1337@gmail.com
            </a>
            .
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudy;
