'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Course {
  id: number;
  title: string;
  description: string;
  long_description: string;
  price: number;
  image_url: string;
  duration_hours: number;
  enrolled: boolean;
  progress: number;
  modules?: Module[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  content: string;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', params.id)
          .single();

        if (courseError) throw courseError;
        if (!courseData) {
          router.push('/courses');
          return;
        }

        // Fetch course modules and lessons
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select(`
            *,
            lessons:course_lessons(
              id,
              title,
              duration,
              content
            )
          `)
          .eq('course_id', params.id)
          .order('order', { ascending: true });

        if (modulesError) throw modulesError;

        // Check if user is enrolled and get progress
        let enrolled = false;
        let progress = 0;
        
        if (user) {
          const { data: enrollment, error: enrollmentError } = await supabase
            .from('user_courses')
            .select('progress')
            .eq('user_id', user.id)
            .eq('course_id', params.id)
            .single();

          if (enrollmentError && enrollmentError.code !== 'PGRST116') {
            console.error('Enrollment error:', enrollmentError);
          }

          if (enrollment) {
            enrolled = true;
            progress = enrollment.progress || 0;
          }
        }

        setCourse({
          ...courseData,
          enrolled,
          progress,
          modules: modulesData?.map(m => ({
            ...m,
            lessons: m.lessons?.map((l: any) => ({
              ...l,
              completed: false // This would be fetched from user progress in a real app
            })) || []
          })) || []
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.id, user, router]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login?redirect=/courses/' + params.id);
      return;
    }

    try {
      setEnrolling(true);
      
      const { error } = await supabase
        .from('user_courses')
        .upsert(
          { 
            user_id: user.id, 
            course_id: Number(params.id),
            progress: 0,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,course_id' }
        );

      if (error) throw error;

      // Update local state
      if (course) {
        setCourse({
          ...course,
          enrolled: true,
          progress: 0
        });
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Course Header */}
      <div className="bg-indigo-700 dark:bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link 
              href="/courses" 
              className="inline-flex items-center text-indigo-200 hover:text-white mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Courses
            </Link>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 text-xl text-indigo-100">
              {course.description}
            </p>
            <div className="mt-6 flex items-center">
              <span className="text-2xl font-bold">${course.price.toFixed(2)}</span>
              {!course.enrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="ml-6 px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              ) : (
                <span className="ml-6 px-4 py-2 rounded-md bg-indigo-600 text-sm font-medium">
                  Enrolled • {course.progress}% Complete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                About This Course
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {course.long_description || 'No detailed description available.'}
              </p>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  What You'll Learn
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Comprehensive curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Hands-on projects</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Expert instructors</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-12 lg:mt-0">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Course Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-gray-900 dark:text-white">{course.duration_hours} hours</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</p>
                  <p className="text-gray-900 dark:text-white">All Levels</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prerequisites</p>
                  <p className="text-gray-900 dark:text-white">None</p>
                </div>
              </div>

              {course.enrolled ? (
                <div className="mt-6">
                  <Link
                    href={`/courses/${course.id}/learn`}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <div className="mt-6">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {course.price > 0 
                      ? `One-time payment of $${course.price.toFixed(2)}`
                      : 'Free enrollment'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Course Curriculum
          </h2>
          
          {course.modules && course.modules.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {module.lessons && module.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson.id} className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-sm font-medium mr-3">
                            {lessonIndex + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {lesson.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {Math.ceil(lesson.duration / 60)} min
                            </p>
                          </div>
                          {lesson.completed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Completed
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No curriculum available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
