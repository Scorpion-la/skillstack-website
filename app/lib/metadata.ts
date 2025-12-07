import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: 'SkillStack - Learn New Skills',
  description: 'Master new skills with SkillStack\'s comprehensive learning resources and booklets.',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};
