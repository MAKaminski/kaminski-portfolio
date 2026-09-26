import { techLogos } from './techLogos';

/**
 * Logos an article or paper can show (Article.logos, Paper.logos), each linked to the company or
 * project behind it. Tool marks reuse the self-hosted set in techLogos.ts;
 * company marks reuse the white wordmarks under /images/logos.
 *
 * Only add a name here when an article or paper is actually about it. Never add the
 * regulated-lender employer (CLAUDE.md rule 7).
 */
export interface ArticleLogo {
  src: string;
  href: string;
  /** Wordmarks are wide; icons are square. Sets the rendered box. */
  shape: 'icon' | 'wordmark';
}

const tool = (name: string, href: string): ArticleLogo => ({ src: techLogos[name], href, shape: 'icon' });

export const articleLogos: Record<string, ArticleLogo> = {
  'Anthropic API': tool('Anthropic API', 'https://www.anthropic.com/api'),
  Claude: tool('Claude', 'https://claude.ai'),
  'Claude Code': tool('Claude Code', 'https://www.anthropic.com/claude-code'),
  MCP: tool('MCP', 'https://modelcontextprotocol.io'),
  GitHub: tool('GitHub', 'https://github.com'),
  Bash: tool('Bash', 'https://www.gnu.org/software/bash/'),
  Python: tool('Python', 'https://www.python.org'),
  'Node.js': tool('Node.js', 'https://nodejs.org'),
  ElevenLabs: tool('ElevenLabs', 'https://elevenlabs.io'),
  Vercel: tool('Vercel', 'https://vercel.com'),
  React: tool('React', 'https://react.dev'),
  Cloudflare: tool('Cloudflare', 'https://www.cloudflare.com'),
  Supabase: tool('Supabase', 'https://supabase.com'),
  'Next.js': tool('Next.js', 'https://nextjs.org'),
  PostHog: tool('PostHog', 'https://posthog.com'),
  Stripe: tool('Stripe', 'https://stripe.com'),
  GreenSky: { src: '/images/logos/greensky.webp', href: 'https://www.greensky.com/', shape: 'wordmark' },
  'Transparent Maintenance': {
    src: '/images/logos/transparent-maintenance.webp',
    href: 'https://www.transparentmaintenance.com',
    shape: 'icon',
  },
  'Genome of Games': {
    src: '/images/logos/genome-of-games.webp',
    href: 'https://genome-of-games.vercel.app',
    shape: 'icon',
  },
};
