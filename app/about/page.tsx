'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component
const ContactForm = dynamic(() => import('./ContactForm'));

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Aditya Saurabh',
      role: 'CEO & Visionary',
      bio: 'The driving force behind SkillStack, Aditya brings innovative ideas and strategic vision to the team. His leadership inspires us to push boundaries in educational technology.',
      image: '/team/aditya_saurabh.jpg',
      highlight: true
    },
    {
      name: 'Aarshu Kumar',
      role: 'CTO & Tech Lead',
      bio: 'Aarshu leads our technical team with exceptional coding skills and innovative solutions. His expertise in full-stack development has been instrumental in building our platform.',
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
    { 
      name: 'Aryan', 
      role: 'Frontend Developer',
      image: '/team/WhatsApp Image 2025-12-03 at 15.55.43_d17ffc7e.jpg',
      bio: 'Aryan specializes in creating responsive and interactive user interfaces. With a keen eye for design and a passion for modern web technologies, he ensures our platform delivers an exceptional user experience across all devices.'
    },
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
    { 
      name: 'Pawan', 
      role: 'Mobile Developer',
      bio: 'Pawan is our mobile development expert, crafting seamless cross-platform experiences. His expertise in React Native and native mobile development helps us deliver our educational content to users on the go with optimal performance and usability.'
    },
    { 
      name: 'Abhishek', 
      role: 'Content Strategist',
      image: '/team/WhatsApp Image 2025-12-01 at 18.49.57_16c7c129.jpg',
      bio: 'Abhishek crafts compelling content strategies that engage and educate our community. His expertise in content creation helps us deliver valuable learning experiences.'
    },
    { 
      name: 'Ankit', 
      role: 'DevOps Engineer',
      image: '/team/WhatsApp Image 2025-12-03 at 15.55.43_d17ffc7e.jpg',
      bio: 'Ankit specializes in DevOps practices, ensuring our infrastructure is scalable, reliable, and efficient. His expertise in CI/CD pipelines and cloud technologies keeps our platform running smoothly.'
    },
    { 
      name: 'Arsalan', 
      role: 'Quality Assurance',
      image: '/team/WhatsApp Image 2025-12-01 at 21.14.39_80d6dc5a.jpg',
      bio: 'Arsalan ensures the highest quality standards for our platform through meticulous testing and quality assurance. His attention to detail helps us deliver a seamless user experience.'
    },
  ];

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
              {teamMembers.map((person, index) => (
                <div
                  key={person.name}
                  className="flex bg-white rounded-lg shadow-md overflow-hidden"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Get in Touch</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              We'd love to hear from you
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
              Have questions or feedback? Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="mt-12">
            <div className="max-w-lg mx-auto lg:max-w-none">
              <ContactForm />
            </div>
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
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="flex justify-center space-x-6">
              {[
                { name: 'Email', href: 'mailto:hello@skillstack.com', icon: '✉️' },
                { name: 'Twitter', href: 'https://twitter.com/skillstack', icon: '🐦' },
                { name: 'LinkedIn', href: 'https://linkedin.com/company/skillstack', icon: '💼' },
                { name: 'Instagram', href: 'https://instagram.com/skillstack', icon: '📸' },
                { name: 'GitHub', href: 'https://github.com/skillstack', icon: '💻' },
              ].map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-gray-400 hover:text-indigo-600 text-2xl"
                  aria-label={item.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <div className="mt-8">
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
