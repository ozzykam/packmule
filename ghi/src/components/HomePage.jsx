import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

const HomePage = () => {
    const navigate = useNavigate()
    const { isAuthenticated, userType, isLoading } = useAuth()

    useEffect(() => {
        // If user is authenticated, redirect to their appropriate dashboard
        if (isAuthenticated && !isLoading) {
            if (userType === 'customer') {
                navigate('/customer/dashboard')
            } else if (userType === 'packer') {
                navigate('/marketplace')
            }
        }
    }, [isAuthenticated, userType, isLoading, navigate])

    // Show loading while auth is being checked
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <div className="flex justify-center items-center mb-6">
                        <img
                            src="/images/packmule_logo.png"
                            alt="PackMule Logo"
                            className="w-16 h-16 mr-4"
                        />
                        <h1 className="text-5xl font-bold text-gray-900">PackMule</h1>
                    </div>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Connect with professional packers for stress-free moving. 
                        Whether you need help with your move or want to earn money helping others, 
                        PackMule makes it simple and secure.
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Customer Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                            <div className="text-4xl mb-4">📦</div>
                            <h2 className="text-2xl font-bold mb-2">Need Moving Help?</h2>
                            <p className="text-blue-100">
                                Post your moving job and connect with professional packers in your area
                            </p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-gray-700">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    Post detailed moving jobs with photos
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    Choose from qualified packers
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    Secure payment and ratings system
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    Track your job from start to finish
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/customer/signin')}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
                            >
                                Customer Sign In
                            </button>
                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/customer/signup')}
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Join as a Customer today!
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Packer Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                            <div className="text-4xl mb-4">💪</div>
                            <h2 className="text-2xl font-bold mb-2">Ready to Earn?</h2>
                            <p className="text-orange-100">
                                Help people move and earn money with your packing and moving skills
                            </p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-gray-700">
                                    <span className="text-orange-500 mr-3">✓</span>
                                    Browse available moving jobs
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="text-orange-500 mr-3">✓</span>
                                    Set your own schedule and rates
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="text-orange-500 mr-3">✓</span>
                                    Build your reputation with reviews
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="text-orange-500 mr-3">✓</span>
                                    Get paid quickly and securely
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/signin')}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
                            >
                                Packer Sign In
                            </button>
                            <p className="text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-orange-500 hover:text-orange-700 font-medium"
                                >
                                    Join as a Packer today!
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose PackMule?</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl mb-4">🛡️</div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h4>
                            <p className="text-gray-600">
                                All packers are verified with secure payment processing and insurance coverage
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-4">⭐</div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h4>
                            <p className="text-gray-600">
                                Rating system ensures you work with the best packers and customers
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-4">📱</div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h4>
                            <p className="text-gray-600">
                                Simple platform that makes booking and managing moves effortless
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage