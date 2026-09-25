import React from 'react';
import type { ProjectCompany } from '../data/projects';
import { track } from '../utils/track';

/**
 * The company a case study was built for: its mark and name, linked to its site.
 * Only studies whose company is public carry one; the regulated-lender study is
 * anonymized by policy (CLAUDE.md rule 7) and never gets a mark.
 */
const CompanyMark: React.FC<{ company: ProjectCompany; slug: string; placement: string }> = ({
  company,
  slug,
  placement,
}) => (
  <a
    href={company.href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => track('Case Study Company Clicked', { company: company.name, slug, placement })}
    className="group inline-flex items-center gap-2.5"
  >
    <img
      src={company.logo}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      className="h-8 w-8 rounded-md opacity-85 transition group-hover:opacity-100"
    />
    <span className="text-sm font-semibold text-white/80 group-hover:text-accent">{company.name}</span>
  </a>
);

export default CompanyMark;
