import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Github, Terminal } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { products, type Product } from '../data/products';


const repoName = (url: string) => url.replace(/^https?:\/\/github\.com\//, '');

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    viewport={{ once: true }}
    className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-accent/60"
  >
    {/* Screenshot (or a fallback panel for tools without one) — links to the GitHub repo */}
    <a
      href={product.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-[16/10] overflow-hidden bg-ink-900"
      aria-label={`Open ${product.name} on GitHub`}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={`${product.name} screenshot`}
          loading="lazy"
          width={1280}
          height={800}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.06] to-transparent">
          <Terminal size={40} className="text-white/20" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-ink-900/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink-900">
          View on GitHub <ArrowUpRight size={16} />
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-accent">
        {product.category}
      </span>
    </a>

    {/* Copy */}
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <a
          href={product.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-white transition-colors duration-200 hover:text-accent"
        >
          {product.name}
        </a>
        <a
          href={product.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 transition-colors duration-200 hover:text-accent"
          aria-label={`Open ${product.name} on GitHub`}
        >
          <ExternalLink size={16} />
        </a>
      </div>
      <a
        href={product.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent/80 hover:text-accent"
      >
        <Github size={13} /> {repoName(product.repoUrl)}
      </a>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-white/70">{product.description}</p>
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Products: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Desktop tools & open-source products by Michael Kaminski',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: p.repoUrl,
      name: p.name,
      description: p.description,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Seo
        title="Products | Michael Kaminski — Desktop Tools & Open Source"
        description="Desktop tools and open-source utilities built by Michael Kaminski — macOS system monitors, touchscreen drivers, ambient context capture, MCP servers, and a product-launch template, all on GitHub."
        canonicalPath="/products"
        breadcrumbName="Products"
        jsonLd={jsonLd}
      />
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Open Source
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Products</h1>
          <p className="text-lg leading-relaxed text-white/70">
            Tools and utilities I&rsquo;ve built and open-sourced on GitHub — system-level
            software that scratches a specific itch, MCP servers that give an agent real tools to
            call, and the template the rest of my launches are built on. Tap any card to see the
            code, install instructions, and releases.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.repoUrl} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
        >
          <h2 className="mb-3 text-xl font-semibold text-white">Have something to build?</h2>
          <p className="mx-auto mb-6 max-w-xl text-white/70">
            I design, engineer, and ship full-stack products end to end. Let&rsquo;s talk about
            what you want to launch.
          </p>
          <a
            href="https://calendly.com/kaminski1337/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-ink-900 shadow-lg transition-all duration-200 hover:brightness-90"
          >
            Book a Call
          </a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
