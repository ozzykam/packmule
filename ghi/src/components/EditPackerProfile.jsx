import { useState, useEffect } from 'react'
import { useEditPackerProfileMutation, useGetUserQuery, useGetPackerProfileQuery } from '../app/apiSlice'
import { useNavigate } from 'react-router-dom'
import SignInForm from './SignInForm'

const EditPackerProfile = () => {
    const navigate = useNavigate()
    const [errorMessage] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')
    const [editProfile, editPofileStatus] = useEditPackerProfileMutation()
    const { data: logged_user, isLoading: isLoggedUserLoading } = useGetUserQuery()
    const { data: packer, isLoading: isPackerLoading } = useGetPackerProfileQuery()

    useEffect(() => {
        if (packer) {
            setUsername(packer.username)
            setName(packer.name)
            setEmail(packer.email)
            setPhone(packer.phone)
            setBio(packer.bio)
        }
    }, [packer])
    
    useEffect(() => {
        if (editPofileStatus.isSuccess) {
            navigate(`/packer/${logged_user.id}`)
        }
    }, [editPofileStatus, navigate, logged_user?.id])

    if (isPackerLoading || isLoggedUserLoading) {
        return <div>Loading Profile...</div>
    }

    if (!packer) {
        return (
            <>
                <div className="mx-auto w-1/2 p-4">
                    <h1> Please log in or sign up to continue!</h1>
                </div>
                <div>
                    <SignInForm />  
                </div>
            </>
        )
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        editProfile({
            username:username,
            name:name,
            email:email,
            phone:phone,
            bio:bio
        })
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleFormSubmit} className="bg-white rounded w-1/2 px-10 pb-8 m-9">
                {errorMessage && <div className="error">{errorMessage}</div>}
                <h1 className="pl-0 pb-8">
                Edit profile
                </h1>
                <div>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={packer.username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={packer.name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Your Full Name"
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={packer.email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        pattern="\d{3}-\d{3}-\d{4}"
                        defaultValue={packer.phone}
                        title="ex: 111-222-3333"
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter Phone Number"
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div>
                    <textarea
                        id="bio"
                        name="bio"
                        defaultValue={packer.bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself!"
                        rows="5"
                        cols="75"
                        maxLength="280"
                        className="appearance-none block w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                    rounded-md py-3 px-4 mb-5 focus:outline-orange-400 focus:bg-white focus:border-gray-500"
                    />
                </div>
                <p className="px-10 pl-0 mb-7">
                    {packer.bio.length}/280 characters
                </p>
                <div className='flex justify-end'>
                    <button
                    type="submit"
                    className="bg-gradient-to-br from-orange-600 to-orange-400 text-white
                    font-bold py-4 px-8 rounded-full shadow-[0_10px_20px_-9px_rgba(227,136,0,1)] focus:outline-none
                    focus:shadow-outline hover:brightness-[1.05] hover:scale-[1.03]
                    hover:shadow-[0_35px_60px_-9px_rgba(227,136,0,0.7)]
                    transition duration-200 ease-in-out">Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditPackerProfile
