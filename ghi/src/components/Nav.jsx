import { NavLink, useNavigate } from 'react-router-dom';
import { useSignoutMutation } from '../app/apiSlice';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Nav = () => {
    const navigate = useNavigate()
    const { isAuthenticated, userType, packer, isLoading } = useAuth()
    const [signout] = useSignoutMutation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignout = async () => {
        try {
            await signout().unwrap()
            navigate('/')
        } catch (error) {
            console.error('Signout error:', error)
            navigate('/')
        }
        setIsMobileMenuOpen(false) // Close mobile menu after action
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    if (isLoading) return <div>Loading Navbar...</div>

    return (
        <>
            <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="w-full flex items-center justify-between px-6 lg:px-8 py-4">
                    {/* Logo - Left Side */}
                    <div className="flex items-center">
                        <NavLink
                            to="/"
                            className="flex items-center space-x-4 text-orange-500 font-bold text-xl tracking-tight"
                        >
                            <img
                                src="images/packmule_logo.png"
                                width="48"
                                height="48"
                                alt="PackMule Logo"
                                className="w-12 h-12"
                            />
                            <span>PackMule</span>
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {userType === 'packer' && (
                            <>
                                <NavLink
                                    to="/marketplace"
                                    className={({ isActive }) =>
                                        `font-semibold transition-colors duration-200 ${
                                            isActive
                                                ? 'text-orange-600 border-b-2 border-orange-600'
                                                : 'text-orange-400 hover:text-orange-600'
                                        }`
                                    }
                                >
                                    Marketplace
                                </NavLink>
                                <NavLink
                                    to="/packer/gigs/booked"
                                    className={({ isActive }) =>
                                        `font-semibold transition-colors duration-200 ${
                                            isActive
                                                ? 'text-orange-600 border-b-2 border-orange-600'
                                                : 'text-orange-400 hover:text-orange-600'
                                        }`
                                    }
                                >
                                    Your Gigs
                                </NavLink>
                                <NavLink
                                    to={`/packer/${packer?.id}`}
                                    className={({ isActive }) =>
                                        `font-semibold transition-colors duration-200 ${
                                            isActive
                                                ? 'text-orange-600 border-b-2 border-orange-600'
                                                : 'text-orange-400 hover:text-orange-600'
                                        }`
                                    }
                                >
                                    Profile
                                </NavLink>
                            </>
                        )}
                        {userType === 'customer' && (
                            <NavLink
                                to="/customer/dashboard"
                                className={({ isActive }) =>
                                    `font-semibold transition-colors duration-200 ${
                                        isActive
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-blue-400 hover:text-blue-600'
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                        )}
                        {!isAuthenticated && (
                            <>
                                <NavLink
                                    to="/packer/signin"
                                    className={({ isActive }) =>
                                        `font-semibold transition-colors duration-200 ${
                                            isActive
                                                ? 'text-orange-600 border-b-2 border-orange-600'
                                                : 'text-orange-400 hover:text-orange-600'
                                        }`
                                    }
                                >
                                    Packer Login
                                </NavLink>
                                <NavLink
                                    to="/customer/signin"
                                    className={({ isActive }) =>
                                        `font-semibold transition-colors duration-200 ${
                                            isActive
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-blue-400 hover:text-blue-600'
                                        }`
                                    }
                                >
                                    Customer Login
                                </NavLink>
                            </>
                        )}
                        {isAuthenticated && (
                            <button
                                onClick={handleSignout}
                                className="font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                Sign Out
                            </button>
                        )}
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `font-semibold transition-colors duration-200 ${
                                    isActive
                                        ? 'text-gray-800 border-b-2 border-gray-800'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`
                            }
                        >
                            About
                        </NavLink>
                    </div>

                    {/* Mobile Hamburger Button - Right Side */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-700 hover:border-gray-700 transition-colors duration-200"
                            aria-label="Toggle navigation menu"
                        >
                            <svg
                                className={`w-6 h-6 transition-transform duration-200 ${
                                    isMobileMenuOpen ? 'rotate-90' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div
                className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                    isMobileMenuOpen
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={closeMobileMenu}
                ></div>

                {/* Sidebar */}
                <div
                    className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="text-lg font-semibold text-gray-800">
                                Menu
                            </span>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Sidebar Navigation */}
                        <div className="flex-1 py-4 overflow-y-auto">
                            <nav className="space-y-2 px-4">
                                {userType === 'packer' && (
                                    <>
                                        <NavLink
                                            to="/marketplace"
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                                                        : 'text-orange-600 hover:bg-orange-50'
                                                }`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                                                />
                                            </svg>
                                            <span>Marketplace</span>
                                        </NavLink>
                                        <NavLink
                                            to="/packer/gigs/booked"
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                                                        : 'text-orange-600 hover:bg-orange-50'
                                                }`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                />
                                            </svg>
                                            <span>Your Gigs</span>
                                        </NavLink>
                                        <NavLink
                                            to={`/packer/${packer?.id}`}
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                                                        : 'text-orange-600 hover:bg-orange-50'
                                                }`
                                            }
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span>Profile</span>
                                        </NavLink>
                                    </>
                                )}
                                {userType === 'customer' && (
                                    <NavLink
                                        to="/customer/dashboard"
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                                                    : 'text-blue-600 hover:bg-blue-50'
                                            }`
                                        }
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <span>Dashboard</span>
                                    </NavLink>
                                )}
                                {!isAuthenticated && (
                                    <>
                                        <NavLink
                                            to="/packer/signin"
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-600'
                                                        : 'text-orange-600 hover:bg-orange-50'
                                                }`
                                            }
                                        >
                                            <span className="material-symbols-outlined">
                                                person_apron
                                            </span>
                                            <span>Packer Login</span>
                                        </NavLink>
                                        <NavLink
                                            to="/customer/signin"
                                            onClick={closeMobileMenu}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                                                        : 'text-blue-600 hover:bg-blue-50'
                                                }`
                                            }
                                        >
                                            <span className="material-symbols-outlined">
                                                person
                                            </span>
                                            <span>Customer Login</span>
                                        </NavLink>
                                    </>
                                )}
                                {isAuthenticated && (
                                    <button
                                        onClick={handleSignout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-md font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                )}
                                <NavLink
                                    to="/about"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                                            isActive
                                                ? 'bg-gray-100 text-gray-800 border-l-4 border-gray-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <span className="material-symbols-outlined">
                                        info
                                    </span>
                                    <span>About</span>
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Nav;
