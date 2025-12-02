'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BookOpenIcon, ChartBarIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock data - in a real app, this would come from your database
const enrolledCourses = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    progress: 65,
    lastAccessed: '2 days ago',
    nextLesson: 'CSS Flexbox and Grid',
  },
  {
    id: 2,
    title: 'Digital Marketing Mastery',
    progress: 30,
    lastAccessed: '1 week ago',
    nextLesson: 'SEO Best Practices',
  },
];

const stats = [
  { name: 'Enrolled Courses', value: '5', icon: BookOpenIcon },
  { name: 'Hours Watched', value: '24', icon: ClockIcon },
  { name: 'Certificates', value: '2', icon: ChartBarIcon },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-indigo-700 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-200">
                  {user?.email}
                </span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-white text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="-mt-24 max-w-7xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">My Learning</h3>
              <p className="mt-1 text-sm text-gray-500">Continue where you left off</p>
            </div>
            <div className="divide-y divide-gray-200">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-indigo-600 hover:text-indigo-500">
                        <Link href={`/courses/${course.id}`}>
                          {course.title}
                        </Link>
                      </h4>
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p>Last accessed {course.lastAccessed}</p>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Next up: {course.nextLesson}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-indigo-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <Link 
                href="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse All Courses
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Link 
                  href="/bookmarks"
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <BookOpenIcon className="h-10 w-10 text-indigo-500" />
                  <span className="mt-2 text-sm font-medium text-gray-900">Bookmarked Lessons</span>
                </Link>
                <Link 
                  href="/certificates"
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <ChartBarIcon className="h-10 w-10 text-indigo-500" />
                  <span className="mt-2 text-sm font-medium text-gray-900">My Certificates</span>
                </Link>
                <Link 
                  href="/profile"
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 border-dashed rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <UserCircleIcon className="h-10 w-10 text-indigo-500" />
                  <span className="mt-2 text-sm font-medium text-gray-900">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
