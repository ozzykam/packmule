import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSigninMutation } from '../app/apiSlice'


const SignInForm = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [signin, signinStatus] = useSigninMutation()

    useEffect(() => {
        if (signinStatus.isSuccess) navigate('/')
        if (signinStatus.isError) {
            setErrorMessage(signinStatus.error.data.detail)
        }
    }, [signinStatus])


    async function handleFormSubmit(e) {
        e.preventDefault()
        signin({
            username: username,
            password: password
        })
    }

    return (
        <div className="flex justify-center outline-gray-100">
        <form className="bg-white rounded-3xl shadow-2xl  w-1/3 px-10 p-10 m-9
        border-2 border-gray-200"
        onSubmit={handleFormSubmit}>
            <h1 className="pl-0 pt-6 pb-2">
                Login
            </h1>
            <p className="px-10 pl-0 mb-7">
                Welcome back
            </p>
            {errorMessage &&
                <div className="bg-red-100 border-l-4 border-red-500 rounded-md
                text-orange-700 py-4 pl-6 mb-4" role="alert">
                    <p class="font-bold">Whoops</p>
                    <p>{errorMessage}</p>
                </div>}
                <div className="flex flex-wrap">
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                        rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                        rounded-md py-3 px-4 mb-9 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                </div>
                <div className='flex justify-end'>
                <button className="bg-gradient-to-br from-orange-600 to-orange-400 text-white
                        font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
                        focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                        hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
                        transition duration-200 ease-in-out" type="submit">Sign In
                </button>
                </div>
        </form>
        </div>
    )
}


export default SignInForm
