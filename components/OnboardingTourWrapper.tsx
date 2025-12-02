'use client';

import dynamic from 'next/dynamic';

const OnboardingTour = dynamic(
  () => import('./OnboardingTour'),
  { ssr: false }
);

export default function OnboardingTourWrapper() {
  return <OnboardingTour />;
}
