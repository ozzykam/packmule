import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomerSigninMutation } from '../app/apiSlice'

const CustomerSignInForm = () => {
    const navigate = useNavigate()
    const [customerSignin, signinStatus] = useCustomerSigninMutation()

    const [form, setForm] = useState({
        username: '',
        password: '',
    })

    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (signinStatus.isSuccess) {
            navigate('/customer/dashboard')
        }
        if (signinStatus.isError) {
            setErrorMessage(signinStatus.error?.data?.detail || 'Sign in failed')
        }
    }, [signinStatus, navigate])

    async function handleFormSubmit(e) {
        e.preventDefault()
        try {
            const result = await customerSignin(form).unwrap()
            console.log('Customer signin successful:', result)
            // Navigate to customer dashboard - backend already validated user type
            navigate('/customer/dashboard')
        } catch (err) {
            console.error('Customer signin error:', err)
        }
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="flex justify-center">
            <form
                onSubmit={handleFormSubmit}
                className="bg-white rounded-3xl shadow-2xl w-1/3 px-10 p-10 m-9 border-2 border-gray-200"
            >
                <h1 className="pl-0 pt-6 pb-2 text-blue-600">Customer Sign In</h1>
                <p className="px-10 pl-0 mb-7">Welcome back! Sign in to book moving services</p>

                {errorMessage && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 rounded-md text-red-700 py-4 pl-6 mb-4"
                        role="alert"
                    >
                        <p className="font-bold">Whoops</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="mb-5">
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md py-3 px-4 focus:outline-blue-400 focus:bg-white"
                    />
                </div>

                <div className="mb-5">
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md py-3 px-4 focus:outline-blue-400 focus:bg-white"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(59,130,246,1)] focus:outline-none focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03] hover:shadow-[0_35px_60px_-9px_rgba(59,130,246,0.7)] transition duration-200 ease-in-out"
                        disabled={signinStatus.isLoading}
                    >
                        {signinStatus.isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don&apos;t have an account? 
                        <button
                            type="button"
                            onClick={() => navigate('/customer/signup')}
                            className="text-blue-500 hover:text-blue-700 font-semibold ml-1"
                        >
                            Sign up here
                        </button>
                    </p>
                    <p className="text-gray-600 mt-2">
                        Are you a mover? 
                        <button
                            type="button"
                            onClick={() => navigate('/packer/signin')}
                            className="text-orange-500 hover:text-orange-700 font-semibold ml-1"
                        >
                            Packer Sign In
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default CustomerSignInForm