import { Metadata } from 'next';
import { defaultMetadata } from '../lib/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'About Us | SkillStack',
  description: 'Learn more about the team behind SkillStack and our mission to revolutionize education.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
