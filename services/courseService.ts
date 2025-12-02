import { supabase } from '@/utils/supabase/client';

export const enrollInCourse = async (courseId: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('/api/enroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to enroll in course');
  }

  return await response.json();
};

export const getEnrolledCourses = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_courses')
    .select(`
      id,
      progress,
      enrolled_at,
      courses (
        id,
        title,
        description,
        image_url,
        duration_hours
      )
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }

  return data;
};

export const markLessonComplete = async (courseId: number, lessonId: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Mark lesson as completed
  const { error: lessonError } = await supabase
    .from('user_lessons')
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString()
      },
      { onConflict: 'user_id,lesson_id' }
    );

  if (lessonError) throw lessonError;

  // Update course progress
  const { data: courseData } = await supabase
    .from('courses')
    .select('total_lessons')
    .eq('id', courseId)
    .single();

  if (!courseData) throw new Error('Course not found');

  const { count: completedLessons } = await supabase
    .from('user_lessons')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('course_id', courseId);

  const progress = Math.round(
    (completedLessons || 0) / (courseData.total_lessons || 1) * 100
  );

  const { error: progressError } = await supabase
    .from('user_courses')
    .update({ 
      progress,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('course_id', courseId);

  if (progressError) throw progressError;

  return { progress };
};