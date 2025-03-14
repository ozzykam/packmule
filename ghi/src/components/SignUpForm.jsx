import { useState, useEffect } from 'react'
import { useSignupMutation, useGetMuleQuery } from '../app/apiSlice'
import { useNavigate, useParams } from 'react-router-dom'

const SignUpForm = () => {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')
    const [signup, signupStatus] = useSignupMutation()
    const { data: mule, isLoading: isMuleLoading } = useGetMuleQuery(undefined, { skip: !signupStatus.isSuccess });

    useEffect(() => {
        if (signupStatus.isSuccess && !isMuleLoading && mule) {
        navigate(`/mule/${mule.id}/specialtys`);
        }
    }, [signupStatus, mule, isMuleLoading, navigate])

    async function handleFormSubmit(e) {
        e.preventDefault()
        signup({
            username:username,
            password:password,
            name:name,
            email:email,
            phone:phone,
            bio:bio
        })
    }

    if (isMuleLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleFormSubmit} className="bg-white rounded w-1/2 px-10 pb-8 m-9">
                {errorMessage && <div className="error">{errorMessage} </div>}
                <h1 className="pl-0 pb-2">
                New movers are waiting
                </h1>
                <p className="px-10 pl-0 mb-7">
                    Let's start with the basics
                </p>
                <div flex flex-wrap>
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
                    type="text"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                </div>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                <input
                    type="tel"
                    name="phone"
                    pattern="\d{3}-\d{3}-\d{4}"
                    value={phone}
                    title="ex: 111-222-3333"
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                <h1 className="pl-0 pb-2">
                    Bio
                </h1>
                <p className="px-10 pl-0 mb-7">
                    Tell us a little bit about yourself
                </p>
                <textarea
                    id="bio"
                    name="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="What do you like to do for fun? Any unique hobbies?"
                    rows="5"
                    cols="75"
                    maxLength="280"
                    className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                />
                <p className="px-10 pl-0 mb-7">
                    {bio.length}/280 characters
                </p>
                <div className='flex justify-end'>
                    <button type="submit" className="bg-gradient-to-br from-orange-600 to-orange-400 text-white
                    font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
                    focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                    hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
                    transition duration-200 ease-in-out" >Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm
