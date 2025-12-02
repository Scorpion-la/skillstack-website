'use client';

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  duration_hours: number;
  enrolled: boolean;
  progress: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Fetch all courses
        console.log('Fetching courses from Supabase...');
        const { data: coursesData, error: coursesError, status, statusText } = await supabase
          .from('courses')
          .select('*');

        console.log('Supabase response:', { coursesData, coursesError, status, statusText });
        
        if (coursesError) {
          console.error('Supabase courses error:', {
            message: coursesError.message,
            details: coursesError.details,
            hint: coursesError.hint,
            code: coursesError.code
          });
          throw coursesError;
        }

        // If user is logged in, check which courses they're enrolled in
        if (user) {
          const { data: userCourses, error: userCoursesError } = await supabase
            .from('user_courses')
            .select('course_id, progress')
            .eq('user_id', user.id);

          if (userCoursesError) throw userCoursesError;

          // Merge course data with enrollment status
          const coursesWithEnrollment = coursesData.map((course: any) => ({
            ...course,
            enrolled: !!userCourses.find((uc: any) => uc.course_id === course.id),
            progress: userCourses.find((uc: any) => uc.course_id === course.id)?.progress || 0
          } as Course));

          setCourses(coursesWithEnrollment);
        } else {
          setCourses(coursesData || []);
        }
      } catch (error: any) {
        console.error('Error in fetchCourses:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          code: error.code,
          details: error.details
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const handleEnroll = async (courseId: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_courses')
        .upsert(
          { 
            user_id: user.id, 
            course_id: courseId,
            progress: 0,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,course_id' }
        );

      if (error) throw error;

      // Update the local state to reflect the enrollment
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, enrolled: true, progress: 0 } 
          : course
      ));
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Our Courses
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Choose from our wide range of courses to enhance your skills.
            </p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {courses.map((course) => (
              <motion.div 
                key={course.id} 
                variants={item}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <Link href={`/courses/${course.id}`} className="block">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src={course.image_url || '/placeholder-course.jpg'} 
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/courses/${course.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">{course.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {course.duration_hours} {course.duration_hours === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                  
                  {course.enrolled ? (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {course.progress}% Complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <Link
                        href={`/courses/${course.id}${course.progress >= 100 ? '/complete' : '/learn'}`}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        {course.progress >= 100 
                          ? 'View Certificate' 
                          : course.progress > 0 
                            ? 'Continue Learning' 
                            : 'Start Learning'}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Enroll Now
                      </button>
                      <Link
                        href={`/courses/${course.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        Learn More
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
