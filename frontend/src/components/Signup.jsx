import React, { useState } from 'react';
import axios from 'axios';
import DynamicTextComponent from './DynamicText';
import Input from './Input';
import { useNavigate } from 'react-router-dom';
import { MdOutlineOfflineBolt } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoIosMail } from 'react-icons/io';
import { useSnackbar } from 'notistack';
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [isVisible, setIsVisible] = useState(true)

    const navigate = useNavigate();
    const enqueueSnackbar = useSnackbar()

    const navigateTo = () => {
        navigate('/Signin');
    }


    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('https://bolt-list-server.vercel.app/user/signup', { username,email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigateTo();
                enqueueSnackbar("Signed Up successfully", {variant: "success"})
            } else {
                setError(response.data.msg);
            }
        } catch (err) {
            setError("An error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid lg:grid-cols-5 sm:grid-cols-1 font-mono min-h-screen transition-all delay-100  duration-300'>
            <div className='lg:col-span-2 flex items-center justify-center bg-darkBg h-full'>
                <MdOutlineOfflineBolt className='text-orange-300 text-[6rem] sm:text-[12rem]' />
            </div>

            <div className='lg:col-span-3 flex flex-col items-center bg-lightBorderColor h-full gap-12 w-full p-6'>
                <div className=' m-1 lg:m-16 text-lightPrimary font-semibold text-center lg:text-2xl text-xl'>
                    <DynamicTextComponent text={text} setText={setText} />
                </div>

                <div className='w-full max-w-xs sm:max-w-sm'>
                    <form onSubmit={handleSignup} className='flex flex-col gap-2 lg:gap-4'>
                        <div className="relative">
                            <FaUser className='absolute left-3 top-5 text-gray-500' />
                            <Input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='e.g: John Doe'
                                required
                                className='pl-10'
                            />

                        </div>
                        <div className='relative'>
                            <IoIosMail className='absolute left-2.5 top-5 text-gray-500 text-[1.1rem]' />

                            <Input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='john@gmail.com'
                                required
                                className='pl-10'
                            />
                        </div>
                        <div className="relative">
                            <RiLockPasswordFill className='absolute left-3 top-5 text-gray-500' />
                            {isVisible? <IoEyeOffOutline className='absolute left-72 sm:left-[22rem] top-5 text-gray-500 hover:text-black' onClick={()=>setIsVisible(!isVisible)}
                            /> : <IoEyeOutline onClick={()=>setIsVisible(!isVisible)}
                                className='absolute left-72 sm:left-[22rem] top-5 text-gray-500 hover:text-black'
                            />
                            }
                            <Input
                                type={isVisible?"password":"text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password...'
                                required
                                className='pl-10'
                            />
                        </div>

                        <button
                            className='mt-4 w-full border-2 p-2 border-gray-400 hover:bg-lightPrimary text-lightPrimary hover:text-lightBorderColor ml-1 sm:ml-2 lg:ml-4 transition-all duration-300 rounded-xl'
                            type="submit"
                            disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                    {error && (
                        <div className='mt-4'>
                            <p className='text-red-500 text-center'>{error}</p>
                        </div>
                    )}
                <div className='flex gap-1 pl-6 lg:pl-20 sm:pl-14 pt-4 lg:pt-8 md:pt-6 '>
                    <p className='text-gray-400'>Already have an account? </p>
                    <button onClick={()=>navigate('/Signin')}>Signin</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
