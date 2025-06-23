import React from 'react'

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">PackMule</h1>
                        <img
                            src="../../public/images/packmule_logo.png"
                            alt="PackMule Logo"
                            className="w-16 h-16 mr-4"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-8 py-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            About the Developer
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Hey there — I’m <strong>Aziz J. Kamara</strong>, a
                            software developer with a bit of a nontraditional
                            path. Before diving headfirst into tech, I spent
                            over a decade working across finance, graphic
                            design, and hospitality. That background taught me
                            how to connect with people, stay adaptable, and
                            think creatively — skills that now shape the way I
                            build software.
                        </p>

                        <p className="text-gray-700 mb-6">
                            <strong>PackMule</strong> is one of the most
                            challenging (and rewarding) projects I’ve taken on
                            so far. It’s a platform designed to help everyday
                            people find and hire reliable gig workers — packers
                            — when they need help moving. Whether you’re
                            offering your time and muscle or just need an extra
                            set of hands, the goal is to make the process
                            simple, intuitive, and stress-free.
                        </p>

                        <p className="text-gray-700 mb-6">
                            At the end of the day, I believe in taking care of
                            people. Family, community, kindness, grace, and
                            compassion — these are the things that matter to me.
                            I try to build tech that reflects those values,
                            whether it’s through the user experience or the
                            intention behind the code.
                        </p>
                        <p className="text-gray-700 mb-6">
                            Thanks for stopping by — I’m glad you’re here.
                        </p>

                        {/* Tech Stack Section */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            PackMule Tech Stack
                        </h2>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">
                                Frontend - User Interface & Experience
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                React-based SPA with modern state management and
                                responsive design
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'React',
                                    'JavaScript',
                                    'Vite',
                                    'React Router',
                                    'Redux Toolkit',
                                    'Tailwind CSS',
                                    'HTML5',
                                    'CSS3',
                                ].map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">
                                Backend API - Business Logic & Data Processing
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                FastAPI-powered REST API with automatic
                                validation and documentation
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'Python',
                                    'FastAPI',
                                    'Pydantic',
                                    'Uvicorn',
                                ].map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">
                                Authentication & Security
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                JWT-based authentication with secure password
                                hashing
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {['JWT', 'BCrypt', 'Jose', 'Cookie Auth'].map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">
                                Database & Storage
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                PostgreSQL for relational data with migration
                                management
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'PostgreSQL',
                                    'Psycopg3',
                                    'Database Migrations',
                                ].map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">
                                Cloud & Hosting
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Multi-platform deployment with Firebase and
                                Railway
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'Firebase',
                                    'Google Cloud Functions',
                                    'Railway',
                                    'Firebase Hosting',
                                ].map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">
                                Development & DevOps
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Containerized development with code quality
                                tools
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'Docker',
                                    'Node.js',
                                    'ESLint',
                                    'Prettier',
                                    'Git',
                                    'PgAdmin',
                                ].map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Links Section */}
                        <div className="bg-gray-50 rounded-lg p-6 mt-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Connect With Me
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="https://magkam.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                                >
                                    <span className="material-symbols-outlined">
                                        captive_portal
                                    </span>
                                    Visit My Website
                                </a>
                                <a
                                    href="mailto:aziz@magkam.com"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Contact Me
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                📍 <strong>Location:</strong> Twin Cities,
                                Minnesota
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About