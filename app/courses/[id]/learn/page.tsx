'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { CheckCircleIcon, PlayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Course {
  id: number;
  title: string;
  description: string;
  enrolled: boolean;
  progress: number;
  current_lesson_id?: number;
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
  video_url?: string;
}

export default function LearnPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user) {
        router.push(`/login?redirect=/courses/${params.id}/learn`);
        return;
      }

      try {
        setLoading(true);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', params.id)
          .single();

        if (courseError || !courseData) {
          throw courseError || new Error('Course not found');
        }

        // Check if user is enrolled
        const { data: enrollment, error: enrollmentError } = await supabase
          .from('user_courses')
          .select('progress, current_lesson_id')
          .eq('user_id', user.id)
          .eq('course_id', params.id)
          .single();

        if (enrollmentError || !enrollment) {
          router.push(`/courses/${params.id}`);
          return;
        }

        // Fetch modules and lessons
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select(`
            *,
            lessons:course_lessons(
              id,
              title,
              duration,
              content,
              video_url,
              order
            )
          `)
          .eq('course_id', params.id)
          .order('order', { ascending: true });

        if (modulesError) throw modulesError;

        // Get completed lessons for this user
        const { data: completedLessons, error: completedError } = await supabase
          .from('user_lessons')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('course_id', params.id);

        if (completedError) throw completedError;

        // Add type for the lesson object from the database
        interface DbLesson {
          id: number;
          title: string;
          duration: number;
          content: string;
          video_url?: string;
          order: number;
        }

        // Add type for the module object from the database
        interface DbModule {
          id: number;
          title: string;
          description: string;
          order: number;
          lessons: DbLesson[];
        }

        const completedLessonIds = new Set(completedLessons?.map((l: { lesson_id: number }) => l.lesson_id) || []);

        // Process modules and lessons
        const modules = (modulesData || [] as DbModule[]).map((module: DbModule) => ({
          ...module,
          lessons: (module.lessons || [] as DbLesson[])
            .map((lesson: DbLesson) => ({
              ...lesson,
              completed: completedLessonIds.has(lesson.id)
            }))
            .sort((a: DbLesson, b: DbLesson) => a.order - b.order)
        }));

        // Find the current lesson (either from enrollment or first lesson)
        let currentLessonId = enrollment.current_lesson_id;
        if (!currentLessonId && modules.length > 0 && modules[0].lessons.length > 0) {
          currentLessonId = modules[0].lessons[0].id;
        }

        const lesson = findLessonInModules(modules, currentLessonId);

        setCourse({
          ...courseData,
          enrolled: true,
          progress: enrollment.progress || 0,
          current_lesson_id: currentLessonId || undefined,
          modules
        });

        if (lesson) {
          setCurrentLesson(lesson);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [params.id, user, router]);

  const findLessonInModules = (modules: Module[], lessonId?: number): Lesson | null => {
    if (!lessonId) return null;
    
    for (const module of modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  const handleLessonSelect = (lessonId: number) => {
    if (!course?.modules) return;
    
    const lesson = findLessonInModules(course.modules, lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      // Update the current lesson in the database
      if (user) {
        supabase
          .from('user_courses')
          .update({ current_lesson_id: lessonId })
          .eq('user_id', user.id)
          .eq('course_id', params.id);
      }
    }
  };

  const markLessonComplete = async () => {
    if (!currentLesson || !user || !course) return;

    try {
      setMarkingComplete(true);
      
      // Mark lesson as completed
      const { error } = await supabase
        .from('user_lessons')
        .upsert(
          {
            user_id: user.id,
            course_id: Number(params.id),
            lesson_id: currentLesson.id,
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw error;

      // Update local state
      if (course.modules) {
        const updatedModules = course.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => 
            lesson.id === currentLesson.id 
              ? { ...lesson, completed: true }
              : lesson
          )
        }));

        // Calculate new progress
        const totalLessons = updatedModules.reduce(
          (sum, module) => sum + module.lessons.length, 0
        );
        const completedLessons = updatedModules.reduce(
          (sum, module) => sum + module.lessons.filter(l => l.completed).length, 0
        );
        const newProgress = Math.round((completedLessons / totalLessons) * 100);

        // Update course progress in the database
        await supabase
          .from('user_courses')
          .update({ progress: newProgress })
          .eq('user_id', user.id)
          .eq('course_id', params.id);

        setCourse({
          ...course,
          modules: updatedModules,
          progress: newProgress
        });
      }

      // Move to next lesson if available
      if (course.modules) {
        const nextLesson = findNextLesson(course.modules, currentLesson.id);
        if (nextLesson) {
          setCurrentLesson(nextLesson);
          // Update current lesson in the database
          await supabase
            .from('user_courses')
            .update({ current_lesson_id: nextLesson.id })
            .eq('user_id', user.id)
            .eq('course_id', params.id);
        }
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setMarkingComplete(false);
    }
  };

  const findNextLesson = (modules: Module[], currentLessonId: number): Lesson | null => {
    let found = false;
    
    for (const module of modules) {
      for (let i = 0; i < module.lessons.length; i++) {
        if (found && !module.lessons[i].completed) {
          return module.lessons[i];
        }
        if (module.lessons[i].id === currentLessonId) {
          found = true;
          // Check if this is the last lesson in the module
          if (i === module.lessons.length - 1) {
            // Find the next module with lessons
            const nextModuleIndex = modules.findIndex(m => m.id === module.id) + 1;
            if (nextModuleIndex < modules.length && modules[nextModuleIndex].lessons.length > 0) {
              return modules[nextModuleIndex].lessons[0];
            }
          }
        }
      }
    }
    
    return null;
  };

  if (loading || !course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-screen overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Link 
                href={`/courses/${params.id}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {course.title}
              </h2>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {course.progress}% Complete
              </p>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {course.modules?.map((module) => (
              <div key={module.id} className="mb-4">
                <h3 className="px-3 text-sm font-medium text-gray-900 dark:text-white">
                  {module.title}
                </h3>
                <div className="mt-1">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                        currentLesson.id === lesson.id
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="flex-shrink-0 mr-3">
                        {lesson.completed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <PlayIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                      <span className="text-left">{lesson.title}</span>
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        {Math.ceil(lesson.duration / 60)} min
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="md:hidden">
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentLesson.title}
            </h1>
            <div className="md:hidden">
              <Link 
                href={`/courses/${params.id}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentLesson.video_url ? (
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-6">
              <video 
                src={currentLesson.video_url}
                className="w-full h-full"
                controls
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-12 text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                <PlayIcon className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {currentLesson.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                This lesson doesn't have a video. Please read the content below.
              </p>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-4xl mx-auto">
            <div 
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: currentLesson.content || 'No content available for this lesson.' }}
            />
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                // Find previous lesson
                if (!course.modules) return;
                const prevLesson = findPreviousLesson(course.modules, currentLesson.id);
                if (prevLesson) {
                  handleLessonSelect(prevLesson.id);
                }
              }}
            >
              Previous
            </button>

            {!currentLesson.completed ? (
              <button
                onClick={markLessonComplete}
                disabled={markingComplete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingComplete ? 'Marking Complete...' : 'Mark as Complete'}
              </button>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                Completed
              </span>
            )}

            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                // Find next lesson
                if (!course.modules) return;
                const nextLesson = findNextLesson(course.modules, currentLesson.id);
                if (nextLesson) {
                  handleLessonSelect(nextLesson.id);
                } else {
                  // No more lessons, go to course completion
                  router.push(`/courses/${params.id}/complete`);
                }
              }}
            >
              {findNextLesson(course.modules || [], currentLesson.id) ? 'Next' : 'Finish Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function findPreviousLesson(modules: Module[], currentLessonId: number): Lesson | null {
    let prevLesson: Lesson | null = null;
    
    for (const module of modules) {
      for (let i = 0; i < module.lessons.length; i++) {
        if (module.lessons[i].id === currentLessonId) {
          return prevLesson;
        }
        prevLesson = module.lessons[i];
      }
    }
    
    return null;
  }
}
