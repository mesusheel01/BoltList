import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Outlet, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Button from './components/Button';
import Todo from './components/Todo';

const SessionCheck = () => {
    const token = localStorage.getItem("token");
    return token ? <Outlet /> : <Navigate to="/" />;
};

const App = () => {
    const [buttonClicked, setButtonClicked] = useState(false);

    return (
        <BrowserRouter>
            {!buttonClicked && <ButtonNavigationToSignInSignUp setButtonClicked={setButtonClicked} />}
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/todo" element={<SessionCheck />}>
                    <Route index element={<Todo />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const ButtonNavigationToSignInSignUp = ({ setButtonClicked }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-lightBg dark:bg-darkBg min-h-screen flex justify-center p-4">
            <div className="flex flex-col text-center flex-wrap sm:flex-grow sm:text-lg lg:text-xl text-wrap items-center mt-20 sm:gap-24 gap-14">
                <div className="grid text-lg sm:text-xl flex-wrap dark:text-lightSecondary text-darkSecondary grid-rows-2 gap-8">
                    <p className="text-xl font-mono">
                        Welcome to <span className="font-thin">Bolt<span className="text-[#FF6500]">List</span></span>
                    </p>
                    <p className="flex flex-wrap sm:flex-grow-0">Create your own space for keeping track of your Activity...</p>
                </div>
                <div className="sm:flex-row flex flex-col gap-2 sm:gap-1">
                    <Button
                        setButtonClicked={setButtonClicked}
                        navigate={navigate}
                        routeTo="Signup"
                    />
                    <Button
                        setButtonClicked={setButtonClicked}
                        navigate={navigate}
                        routeTo="Signin"
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
