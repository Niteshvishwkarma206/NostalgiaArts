import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[75vh] grid place-items-center px-4 text-center"
    >
      <div>
        <Compass className="mx-auto text-gold-500 mb-6" size={44} />
        <p className="font-serif text-7xl font-semibold text-onyx-200 dark:text-onyx-800">404</p>
        <h1 className="font-serif text-3xl mt-2">This piece isn't on display</h1>
        <p className="text-onyx-500 dark:text-onyx-400 mt-2 max-w-sm mx-auto">
          The page you're looking for may have been moved or no longer exists.
        </p>
        <Link to="/" className="btn-gold mt-8 inline-flex">
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
