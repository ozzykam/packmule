import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomerSignupMutation } from '../app/apiSlice'

const CustomerSignUpForm = () => {
    const navigate = useNavigate()
    const [customerSignup, signupStatus] = useCustomerSignupMutation()

    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        bio: '',
    })

    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (signupStatus.isSuccess) {
            navigate('/customer/dashboard')
        }
        if (signupStatus.isError) {
            setErrorMessage(signupStatus.error?.data?.detail || 'Signup failed')
        }
    }, [signupStatus, navigate])

    async function handleFormSubmit(e) {
        e.preventDefault()
        try {
            const result = await customerSignup(form).unwrap()
            console.log('Customer signup successful:', result)
            
            // Navigate to customer dashboard after successful signup
            setTimeout(() => {
                navigate('/customer/dashboard')
            }, 100)
        } catch (err) {
            console.error('Customer signup error:', err)
        }
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="flex justify-center">
            <form
                onSubmit={handleFormSubmit}
                className="bg-white rounded-3xl shadow-2xl px-10 p-10 m-9 border-2 border-gray-200"
            >
                <h1 className="pl-0 pt-6 pb-2 text-blue-600">Customer Sign Up</h1>
                <p className="px-10 pl-0 mb-7">Create your customer account to book moving services</p>

                {errorMessage && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 rounded-md text-red-700 py-4 pl-6 mb-4"
                        role="alert"
                    >
                        <p className="font-bold">Whoops</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {['username', 'password', 'name', 'email', 'phone', 'bio'].map(
                    (field) => (
                        <div key={field} className="mb-5">
                            <input
                                type={
                                    field === 'password'
                                        ? 'password'
                                        : field === 'email'
                                        ? 'email'
                                        : field === 'phone'
                                        ? 'tel'
                                        : 'text'
                                }
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                                placeholder={
                                    field === 'bio' 
                                        ? 'Tell us about yourself (optional)'
                                        : field.charAt(0).toUpperCase() + field.slice(1)
                                }
                                required={field !== 'bio'}
                                className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md py-3 px-4 focus:outline-blue-400 focus:bg-white"
                            />
                        </div>
                    )
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(59,130,246,1)] focus:outline-none focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03] hover:shadow-[0_35px_60px_-9px_rgba(59,130,246,0.7)] transition duration-200 ease-in-out"
                        disabled={signupStatus.isLoading}
                    >
                        {signupStatus.isLoading ? 'Creating Account...' : 'Create Customer Account'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Need moving services? 
                        <button
                            type="button"
                            onClick={() => navigate('/customer/signin')}
                            className="text-blue-500 hover:text-blue-700 font-semibold ml-1"
                        >
                            Sign in here
                        </button>
                    </p>
                    <p className="text-gray-600 mt-2">
                        Are you a mover? 
                        <button
                            type="button"
                            onClick={() => navigate('/packer/signup')}
                            className="text-orange-500 hover:text-orange-700 font-semibold ml-1"
                        >
                            Join as a Packer
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default CustomerSignUpForm