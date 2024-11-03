import React, { useState } from 'react';
import axios from 'axios';
import Todo from './Todo';
import DynamicTextComponent from './DynamicText';
import { useNavigate } from 'react-router-dom';
import { MdOutlineOfflineBolt } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import Input from './Input';
import { RiLockPasswordFill } from 'react-icons/ri';

const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("")
    const navigate = useNavigate()
    const navigateTo =()=>{
        navigate('/todo')
}

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/user/signin', { username, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                console.log(response.data.token);
                navigateTo()
            } else {
                setError("Invalid credentials!");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during Signing In.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='grid lg:grid-cols-5 sm:grid-cols-1 font-mono min-h-screen'>
            <div className='lg:col-span-2 flex items-center justify-center bg-darkBg h-full'>
                <MdOutlineOfflineBolt className='text-orange-300 text-[6rem] sm:text-[8rem] lg:text-[12rem]' />
            </div>

            <div className='lg:col-span-3 flex flex-col items-center bg-lightBorderColor h-full gap-12 w-full p-6'>
                <div className='mt-10 sm:mt-16 text-lightPrimary lg:text-2xl md:text-xl  text-xl font-semibold text-center'>
                    <DynamicTextComponent username={username} text={text} setText={setText} />
                </div>

                <div className='w-full max-w-xs sm:max-w-sm'>
                    <form onSubmit={handleSignIn} className='flex flex-col gap-4'>
                        <div className="relative">
                            <FaUser className='absolute left-3 top-5 text-gray-500' />
                            <Input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Enter your username...'
                                required
                                className='pl-10'
                            />
                        </div>

                        <div className="relative">
                            <RiLockPasswordFill className='absolute left-3 top-5 text-gray-500' />

                            <Input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password...'
                                required
                                className='pl-10'
                            />
                        </div>

                        <button
                            className='mt-4 w-full border-2 p-2 border-gray-400 hover:bg-lightPrimary text-lightPrimary hover:text-lightBorderColor
                            ml-1 sm:ml-4 transition-all duration-500 rounded-xl'
                            type="submit"
                            disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    {error && (
                        <div className='mt-4'>
                            <p className='text-red-500 text-center'>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signin;
