import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-onyx-200 dark:border-onyx-800 bg-onyx-50 dark:bg-onyx-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-serif text-xl font-semibold">
            Era <span className="text-gold-500">Nostalgia</span>
          </span>
          <p className="mt-3 text-sm text-onyx-500 dark:text-onyx-400 leading-relaxed">
            A premium gallery of paintings, digital art, photography, and sculpture — curated for
            collectors who value permanence.
          </p>
          <div className="flex gap-3 mt-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid place-items-center h-9 w-9 rounded-full border border-onyx-200 dark:border-onyx-800 text-onyx-500 hover:border-gold-500 hover:text-gold-500 transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-onyx-500 dark:text-onyx-400">
            <li><Link to="/gallery" className="hover:text-gold-500">Gallery</Link></li>
            <li><Link to="/categories" className="hover:text-gold-500">Categories</Link></li>
            <li><Link to="/artists" className="hover:text-gold-500">Artists</Link></li>
            <li><Link to="/favorites" className="hover:text-gold-500">Favorites</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Gallery</p>
          <ul className="space-y-2 text-sm text-onyx-500 dark:text-onyx-400">
            <li><Link to="/about" className="hover:text-gold-500">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold-500">Contact</Link></li>
            <li><Link to="/login" className="hover:text-gold-500">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-gold-500">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3">Get in Touch</p>
          <ul className="space-y-3 text-sm text-onyx-500 dark:text-onyx-400">
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 shrink-0" />
              <a href="mailto:eranostalgia3@gmail.com" className="hover:text-gold-500">eranostalgia3@gmail.com</a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-0.5 shrink-0" />
              <a href="tel:+918120524261" className="hover:text-gold-500">+91 8120524261</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>Bhopal Naka, Murli, Sehore, Madhya Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-onyx-200 dark:border-onyx-800 py-6 text-center text-xs text-onyx-400">
        © {new Date().getFullYear()} Era Nostalgia. All rights reserved.
      </div>
    </footer>
  );
}
