import React from 'react'

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">About PackMule</h1>
                        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                            Built by Aziz J. Kamara - connecting people through technology and meaningful solutions
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-8 py-12">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Developer</h2>
                        
                        <p className="text-gray-700 mb-6">
                            Hi! I'm <strong>Aziz J. Kamara</strong>, a dedicated and passionate software developer with a unique background 
                            spanning financial services, graphic design, and hospitality. I bring a diverse perspective to software 
                            development with a background in finance and design, which allows me to create user-friendly and efficient applications.
                        </p>

                        <p className="text-gray-700 mb-6">
                            <strong>PackMule</strong> represents one of my capstone projects - a moving app that connects gig workers 
                            with individuals in need of moving services. This platform embodies my belief in using technology to 
                            create meaningful connections and solve real-world problems.
                        </p>

                        <p className="text-gray-700 mb-8">
                            I believe in <em>family and community first</em>, and I am driven by the principle that in order to make 
                            the world a better place, we must operate from a place of kindness, grace, and compassion. These values 
                            guide both my professional work and personal life, and I strive to embody them in every project I undertake.
                        </p>

                        {/* Technical Skills */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">PackMule Tech Stack</h3>
                        
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">Frontend</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'React', 'JavaScript', 'Vite', 'React Router', 'Redux Toolkit', 
                                    'Tailwind CSS', 'HTML5', 'CSS3'
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
                            <h4 className="text-lg font-medium text-gray-800 mb-3">Backend</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'Python', 'FastAPI', 'Pydantic', 'Uvicorn', 'JWT', 'BCrypt'
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
                            <h4 className="text-lg font-medium text-gray-800 mb-3">Database & Cloud</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'PostgreSQL', 'Firebase', 'Google Cloud Functions'
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

                        <div className="mb-8">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">DevOps & Tools</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {[
                                    'Docker', 'Node.js', 'ESLint', 'Prettier', 'Git'
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
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect With Me</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="https://magkam.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9a9 9 0 01-9-9m9 9c0 5-4 9-9 9s-9-4-9-9m0 0a9 9 0 019-9" />
                                    </svg>
                                    Visit My Website
                                </a>
                                <a 
                                    href="mailto:aziz@magkam.com"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Me
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                📍 <strong>Location:</strong> Twin Cities, Minnesota
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About