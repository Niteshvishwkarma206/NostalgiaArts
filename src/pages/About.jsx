import { motion } from 'framer-motion';
import { Gem, ShieldCheck, Globe2 } from 'lucide-react';

const VALUES = [
  {
    icon: Gem,
    title: 'Curated, Not Crowded',
    body: 'Every piece is reviewed before it reaches the gallery — we would rather show fewer works, well.',
  },
  {
    icon: ShieldCheck,
    title: 'Provenance First',
    body: 'Artist details, edition information, and condition notes are documented for every acquisition.',
  },
  {
    icon: Globe2,
    title: 'Built for Collectors',
    body: 'From first-time buyers to seasoned collectors, our team helps you build a collection with intent.',
  },
];

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <p className="section-eyebrow">Our Story</p>
        <h1 className="page-title mt-2">About Era Nostalgia</h1>
        <p className="mt-6 text-lg text-onyx-500 dark:text-onyx-400 leading-relaxed">
          Era Nostalgia began as a small showroom with a simple idea: pair collectors with
          artwork that will still matter to them in twenty years. Today we work with painters,
          digital artists, photographers, and sculptors around the world, bringing their work to
          a gallery built as carefully as the pieces it holds.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-8">
              <div className="h-11 w-11 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center mb-4">
                <Icon size={20} />
              </div>
              <p className="font-serif text-xl mb-2">{title}</p>
              <p className="text-sm text-onyx-500 dark:text-onyx-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-24 mb-4">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1800"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-onyx-950/70" />
        </div>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-serif text-3xl text-white italic leading-relaxed">
            "We think of the gallery as a long conversation between an artist's hand and a
            collector's eye — our job is simply to make the introduction."
          </p>
          <p className="mt-4 text-gold-400 text-sm tracking-wide">— The Era Nostalgia Team</p>
        </div>
      </section>
    </motion.div>
  );
}
