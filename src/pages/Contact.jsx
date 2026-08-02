import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import GalleryMap from '../components/GalleryMap.jsx';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.message.trim()) e.message = 'Please add a short message';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast('Message sent — we will get back to you shortly.', 'success');
      setForm({ name: '', email: '', message: '' });
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow">Get in Touch</p>
      <h1 className="page-title mt-1 mb-10">Contact Us</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <input
                className="input-field"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                className="input-field"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <textarea
                className="input-field min-h-[140px] resize-none"
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>
            <button type="submit" disabled={sending} className="btn-gold w-full sm:w-auto">
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center shrink-0">
                <Mail size={17} />
              </span>
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href="mailto:eranostalgia3@gmail.com" className="text-sm text-onyx-500 dark:text-onyx-400 hover:text-gold-500">
                  eranostalgia3@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center shrink-0">
                <Phone size={17} />
              </span>
              <div>
                <p className="text-sm font-medium">Mobile</p>
                <a href="tel:+918120524261" className="text-sm text-onyx-500 dark:text-onyx-400 hover:text-gold-500">
                  +91 8120524261
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center shrink-0">
                <MapPin size={17} />
              </span>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-onyx-500 dark:text-onyx-400">
                  Bhopal Naka, Murli, Sehore, Madhya Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[420px] lg:h-auto rounded-2xl overflow-hidden border border-onyx-200 dark:border-onyx-800">
          <GalleryMap />
        </div>
      </div>
    </motion.div>
  );
}
