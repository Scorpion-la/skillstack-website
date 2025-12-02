'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter, Instagram, Github } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-indigo-900">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">From Classroom to</span>
              <span className="block text-indigo-200">Changing the World</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              How a group of ambitious students is revolutionizing education, one skill at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-12 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Journey</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The Genesis of SkillStack
            </p>
          </div>

          <div className="relative">
            <div className="lg:mx-auto lg:max-w-4xl lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
              <div className="relative">
                <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                  <div className="pt-12 sm:pt-16 lg:pt-20">
                    <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      Born in a Dorm Room
                    </h3>
                    <p className="mt-6 text-lg text-gray-600">
                      It all started when a group of high school students, frustrated with the limitations of traditional education, decided to take matters into their own hands. What began as a simple coding project quickly evolved into a mission to democratize education globally.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                  <div className="relative pt-12 pb-10 px-6 bg-indigo-600 rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative">
                      <div className="text-white text-5xl font-extrabold">
                        "
                      </div>
                      <blockquote className="mt-6">
                        <p className="text-lg font-medium text-white">
                          We believe that education should be accessible, engaging, and tailored to the digital age. Our platform is built by students, for students, with the vision of making learning as addictive as social media.
                        </p>
                      </blockquote>
                      <footer className="mt-6">
                        <p className="text-base font-medium text-indigo-100">
                          The SkillStack Team
                        </p>
                        <p className="text-base font-medium text-indigo-200">
                          Founders & Visionaries
                        </p>
                      </footer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Team */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">The Masterminds</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Meet the Visionary Team
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              A diverse group of young innovators redefining what's possible in education technology.
            </p>
          </div>

          <div className="mt-20">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Aditya Saurabh',
                  role: 'CEO & Visionary',
                  bio: 'The driving force behind SkillStack, Aditya brings innovative ideas and strategic vision to the team. His leadership inspires us to push boundaries in educational technology.',
                  image: '/team/aditya_saurabh.jpg',
                  highlight: true
                },
                {
                  name: 'Aarahu Kumar',
                  role: 'CTO & Tech Lead',
                  bio: 'Aarahu leads our technical team with exceptional coding skills and innovative solutions. His expertise in full-stack development has been instrumental in building our platform.',
                  image: '/team/WhatsApp Image 2025-12-02 at 18.58.08_57bf0a95.jpg',
                  highlight: true
                },
                {
                  name: 'Ravindra Kumar Yadav',
                  role: 'Head of Operations',
                  bio: 'Ravindra ensures our operations run smoothly. His attention to detail and problem-solving skills keep our team aligned and productive.',
                  image: '/team/WhatsApp Image 2025-12-01 at 20.55.27_a4068552.jpg',
                  highlight: true
                },
                { name: 'Aryan', role: 'Frontend Developer' },
                { 
                  name: 'Shivraj', 
                  role: 'Backend Developer',
                  image: '/team/WhatsApp Image 2025-12-01 at 21.18.05_163fac19.jpg',
                  bio: 'Shivraj specializes in building robust and scalable backend systems. His expertise in server-side development ensures our platform runs smoothly and efficiently.'
                },
                { 
                  name: 'Rudransh', 
                  role: 'UI/UX Designer',
                  image: '/team/WhatsApp Image 2025-12-01 at 20.55.05_703bdc31.jpg',
                  bio: 'Rudransh brings designs to life with a keen eye for aesthetics and user experience. His creative vision ensures our platform is both beautiful and intuitive for all users.'
                },
                { name: 'Pawan', role: 'Mobile Developer' },
                { 
                  name: 'Abhishek', 
                  role: 'Content Strategist',
                  image: '/team/WhatsApp Image 2025-12-01 at 18.49.57_16c7c129.jpg',
                  bio: 'Abhishek crafts compelling content strategies that engage and educate our community. His expertise in content creation helps us deliver valuable learning experiences.'
                },
                { name: 'Ankit', role: 'DevOps Engineer' },
                { 
                  name: 'Arsalan', 
                  role: 'Quality Assurance',
                  image: '/team/WhatsApp Image 2025-12-01 at 21.14.39_80d6dc5a.jpg',
                  bio: 'Arsalan ensures the highest quality standards for our platform through meticulous testing and quality assurance. His attention to detail helps us deliver a seamless user experience.'
                },
              ].map((person, index) => (
                <motion.div
                  key={person.name}
                  className="flex bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {person.image && (
                    <div className="flex-shrink-0">
                      <img className="h-48 w-48 object-cover" src={person.image} alt={person.name} />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className={`text-lg font-medium ${person.highlight ? 'text-indigo-600 font-bold' : 'text-gray-900'}`}>
                    {person.name}
                    {person.highlight && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                        Core Team
                      </span>
                    )}
                  </h3>
                    <p className="text-indigo-600">{person.role}</p>
                    {person.bio && <p className="mt-2 text-gray-600">{person.bio}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-600">
              Have questions? Want to collaborate? We'd love to hear from you!
            </p>
          </div>
          <div className="mt-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Let's talk
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to join the education revolution?</span>
            <span className="block text-indigo-600">Connect with us today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              {[
                { name: 'Email', icon: Mail, href: 'mailto:hello@skillstack.com' },
                { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/skillstack' },
                { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/skillstack' },
                { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/skillstack' },
                { name: 'GitHub', icon: Github, href: 'https://github.com/skillstack' },
              ].map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-indigo-600">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} SkillStack. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
