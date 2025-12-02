'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function CourseCompletePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<{ title: string; id: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        router.push(`/login?redirect=/courses/${params.id}/complete`);
        return;
      }

      try {
        setLoading(true);

        // Verify course completion
        const { data: enrollment, error: enrollmentError } = await supabase
          .from('user_courses')
          .select('progress')
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .single();

        if (enrollmentError || !enrollment || enrollment.progress < 100) {
          router.push(`/courses/${params.id}`);
          return;
        }

        // Get course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title')
          .eq('id', params.id)
          .single();

        if (courseError || !courseData) {
          throw courseError || new Error('Course not found');
        }

        setCourse(courseData);

        // In a real app, you would generate a certificate here
        // For now, we'll just set a placeholder
        setCertificateUrl(`/api/certificates/${user.id}/${params.id}`);
      } catch (error) {
        console.error('Error:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, user, router]);

  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Congratulations! 🎉
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            You've successfully completed the <span className="font-semibold">{course.title}</span> course.
          </p>
          
          <div className="mt-10 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Certificate of Completion
            </h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    Certificate of Completion
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {course.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Awarded to: {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={certificateUrl || '#'}
                download
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download Certificate (PDF)
              </a>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Print Certificate
              </button>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What's next?
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/courses"
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Browse More Courses</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Explore our full catalog of courses</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Go to Dashboard</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View your learning progress</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to course
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
