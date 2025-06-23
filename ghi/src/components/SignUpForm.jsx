import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignupMutation } from '../app/apiSlice'

const SignUpForm = () => {
    const navigate = useNavigate()
    const [signup, signupStatus] = useSignupMutation()

    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        bio: '',
        user_type: 'packer', // Set packer type
    })

    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (signupStatus.isSuccess) {
            navigate('/')
        }
        if (signupStatus.isError) {
            setErrorMessage(signupStatus.error?.data?.error || 'Signup failed')
        }
    }, [signupStatus, navigate])

    async function handleFormSubmit(e) {
        e.preventDefault()
        try {
            const response = await signup(form).unwrap()
            if (response.token) {
                localStorage.setItem('token', response.token)
            }
        } catch (err) {
            console.error('Signup error:', err)
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
                <h1 className="pl-0 pt-6 pb-2">Sign Up</h1>
                <p className="px-10 pl-0 mb-7">Create your account</p>

                {errorMessage && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 rounded-md text-orange-700 py-4 pl-6 mb-4"
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
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md py-3 px-4 focus:outline-orange-400 focus:bg-white"
                            />
                        </div>
                    )
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-gradient-to-br from-orange-600 to-orange-400 text-white font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03] hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)] transition duration-200 ease-in-out"
                    >
                        {signupStatus.isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm
