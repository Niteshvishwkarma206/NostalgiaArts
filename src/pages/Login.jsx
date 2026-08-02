import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ADMIN_EMAIL } from '../firebase.js';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      const redirectTo =
        location.state?.from?.pathname || (email === ADMIN_EMAIL ? '/admin' : '/');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed. Check your credentials.', 'error');
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
        <p className="section-eyebrow text-center">Welcome Back</p>
        <h1 className="page-title text-3xl text-center mt-1 mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-gold-600 dark:text-gold-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-onyx-500 dark:text-onyx-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
