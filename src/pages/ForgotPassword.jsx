import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      showToast('Password reset instructions sent.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not process request.', 'error');
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
      <div className="w-full max-w-sm text-center">
        <div className="h-14 w-14 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center mx-auto mb-5">
          <KeyRound size={22} />
        </div>
        <h1 className="page-title text-3xl mb-2">Reset Password</h1>
        <p className="text-sm text-onyx-500 dark:text-onyx-400 mb-8">
          Enter the email on your account and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-6 flex flex-col items-center gap-2">
            <Mail className="text-gold-500" size={22} />
            <p className="text-sm">Check <span className="font-medium">{email}</span> for further instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              type="email"
              required
              className="input-field"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-gold w-full">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Reset Link
            </button>
          </form>
        )}

        <p className="text-sm text-onyx-500 dark:text-onyx-400 mt-8">
          <Link to="/login" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
