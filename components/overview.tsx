import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconTheme = theme === 'light' ? 'light' : 'dark';
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-4 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-2 items-center">
          {mounted && <VercelIcon size={36} theme={iconTheme} />}
          <span>+</span>
          {mounted && <MessageIcon size={36} theme={iconTheme} />}
        </p>
        <p>
          <span className="font-bold text-lg">FinBot</span>
        </p>
        <p className="italic font-light">
          This AI-powered study companion adapts to your learning style. Track your progress, dive into study materials & gain valuable insights through an intuitive interface that makes learning finance effortless.
        </p>
      </div>
    </motion.div>
  );
};
