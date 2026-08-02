import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      showToast('Account created — welcome to Era Nostalgia!', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      showToast(err.message || 'Could not create account.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] grid place-items-center px-4 py-16"
    >
      <div className="w-full max-w-sm">
        <p className="section-eyebrow text-center">Join the Gallery</p>
        <h1 className="page-title text-3xl text-center mt-1 mb-8">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="input-field"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            className="input-field"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="input-field"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-onyx-500 dark:text-onyx-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
