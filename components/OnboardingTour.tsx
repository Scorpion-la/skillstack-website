'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type PageSteps = {
  [key: string]: Step[];
};

export default function OnboardingTour() {
  const [instanceId] = useState(`tour-${uuidv4()}`);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const pathname = usePathname();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonHover = {
    scale: 1.03,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  const buttonTap = { scale: 0.98 };

  // Define steps for different pages
  const pageSteps: PageSteps = {
    '/': [
      {
        target: 'body',
        title: 'Welcome to SkillStack!',
        content: 'Let me show you around our platform.',
        placement: 'center',
        disableBeacon: true,
      },
      {
        target: 'nav',
        title: 'Navigation',
        content: 'Use this menu to explore different sections of our platform.',
        placement: 'bottom',
      },
      {
        target: 'main',
        title: 'Featured Content',
        content: 'Here you\'ll find our latest courses and resources.',
        placement: 'top',
      },
    ],
    '/dashboard': [
      {
        target: '.dashboard-stats',
        title: 'Your Progress',
        content: 'Track your learning journey and see your achievements here.',
        placement: 'bottom',
      },
      {
        target: '.recent-courses',
        title: 'Your Courses',
        content: 'Continue learning from where you left off.',
        placement: 'left',
      },
    ],
    // Add more pages as needed
  };

  // Handle tour completion and step changes
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    setCurrentStep(index);

    if (finishedStatuses.includes(status)) {
      localStorage.setItem('onboardingCompleted', 'true');
      setRun(false);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('onboardingCompleted') === 'true';
    const currentPageSteps = pageSteps[pathname] || [];
    setSteps(currentPageSteps);
    
    if (currentPageSteps.length > 0 && !hasCompletedTour) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (steps.length === 0 || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={instanceId}
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Joyride
          steps={steps}
          run={run}
          continuous
          showProgress
          showSkipButton
          hideCloseButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#7C3AED',
              textColor: '#1F2937',
              backgroundColor: '#FFFFFF',
              overlayColor: 'rgba(0, 0, 0, 0.6)',
              spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
            },
            tooltipContainer: {
              textAlign: 'left',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid rgba(124, 58, 237, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            tooltipTitle: {
              color: '#1F2937',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            tooltipContent: {
              color: '#4B5563',
              fontSize: '1rem',
              lineHeight: '1.5',
              padding: '0.5rem 0',
            },
            buttonNext: {
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              padding: '0.5rem 1.25rem',
              fontSize: '0.9375rem',
              fontWeight: '500',
            },
            buttonBack: {
              color: '#7C3AED',
              fontSize: '0.9375rem',
              fontWeight: '500',
              padding: '0.5rem 1rem',
            },
            buttonSkip: {
              color: '#6B7280',
              fontSize: '0.875rem',
            },
            beacon: {
              backgroundColor: '#7C3AED',
            },
            spotlight: {
              borderRadius: '0.5rem',
            },
          }}
          floaterProps={{
            styles: {
              floater: {
                filter: 'none',
              },
            },
          }}
        />
      </motion.div>
      <style jsx global>{`
        .react-joyride__tooltip {
          max-width: 320px !important;
        }
        .react-joyride__tooltip h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .react-joyride__tooltip h3:before {
          content: '🚀';
          font-size: 1.5rem;
        }
        .react-joyride__beacon {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(124, 58, 237, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
          }
        }
        .react-joyride__spotlight {
          transition: all 0.3s ease;
        }
        .react-joyride__tooltip button {
          transition: all 0.2s ease;
        }
        .react-joyride__tooltip button:hover {
          transform: translateY(-1px);
        }
        .react-joyride__tooltip button:active {
          transform: translateY(0);
        }
      `}</style>
    </AnimatePresence>
  );
}
