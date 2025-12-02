'use client';

import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon, AcademicCapIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    name: 'Expert-Led Courses',
    description: 'Learn from industry professionals with years of experience in their fields.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Comprehensive Booklets',
    description: 'Access our detailed booklets that complement your learning journey.',
    icon: BookOpenIcon,
  },
  {
    name: 'Track Your Progress',
    description: 'Monitor your learning journey and see how far you\'ve come.',
    icon: ChartBarIcon,
  },
];

const courses = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript.',
    price: 49.99,
    image: '/web-dev.jpg',
  },
  {
    id: 2,
    title: 'Digital Marketing Mastery',
    description: 'Master SEO, social media, and content marketing strategies.',
    price: 59.99,
    image: '/digital-marketing.jpg',
  },
  {
    id: 3,
    title: 'Data Science Essentials',
    description: 'Introduction to data analysis and visualization with Python.',
    price: 69.99,
    image: '/data-science.jpg',
  },
];

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-indigo-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Master New Skills</span>
                  <span className="block text-indigo-200">With SkillStack</span>
                </h1>
                <p className="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Unlock your potential with our comprehensive courses and booklets designed to help you learn in-demand skills at your own pace.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {!user && (
                    <div className="rounded-md shadow">
                      <Link
                        href="/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                  <div className={`${!user ? 'mt-3 sm:mt-0 sm:ml-3' : ''}`}>
                    <Link
                      href="/courses"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      {user ? 'Browse Courses' : 'View Courses'}
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="People learning together"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to learn
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform is designed to help you achieve your learning goals efficiently and effectively.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Booklets</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Popular Booklets
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explore our most popular booklets to kickstart your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {courses.map((course) => (
              <div key={course.id} className="group">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{course.title}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${course.price.toFixed(2)}</p>
                <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                  Add to cart <ArrowRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/booklets"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Booklets
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start learning?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of learners who have already transformed their skills with SkillStack.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}