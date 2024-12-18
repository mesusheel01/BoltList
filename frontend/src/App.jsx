import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Button from './components/Button';
import Todo from './components/Todo';


const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                    <Route path="/Signup" element={<Signup />} />
                    <Route path="/Signin" element={<Signin />} />
                    <Route path='/Todo' element={<Todo />} />
            </Routes>
        </BrowserRouter>
    );
};

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-lightBg dark:bg-darkBg min-h-screen flex flex-col justify-center items-center p-4">
            <div className="flex flex-col text-center flex-wrap sm:flex-grow sm:text-xl text-xl lg:text-2xl text-wrap items-center mt-20 sm:gap-24 gap-14 flex-grow">
                <div className="grid sm:text-xl text-xl lg:text-2xl flex-wrap dark:text-lightSecondary text-darkSecondary grid-rows-2 gap-8">
                    <p className="sm:text-xl text-xl lg:text-2xl font-mono">
                        Welcome to <span className="font-thin">Bolt<span className="text-[#FF6500]">List</span></span>
                    </p>
                    <p className="flex flex-wrap sm:flex-grow-0">Create your own space for keeping track of your Activity...</p>
                </div>
                <div className="sm:flex-row flex flex-col gap-2 sm:gap-3">
                    <Button
                        navigate={navigate}
                        routeTo="Signup"
                    />
                    <Button
                        navigate={navigate}
                        routeTo="Signin"
                    />
                </div>
            </div>

            <footer className="text-gray-600 text-center py-4">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} BoltList. All rights reserved.
                </p>
            </footer>
        </div>

    );
};

export default App;
