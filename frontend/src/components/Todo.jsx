import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from './Input';
import { TbPointFilled } from 'react-icons/tb'
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
import { FaUserNinja } from 'react-icons/fa';
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi'
import useSound from 'use-sound'
import clear from '../sounds/clearAll.mp3'
import error from '../sounds/error.mp3'
import add from '../sounds/created.mp3'
import logout from '../sounds/logout.mp3'
import complete from '../sounds/completed.mp3'

const Todo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [moveNinja, setMoveNinja] = useState(false)
    const [isTodoEditing, setIsTodoEditing] = useState(false)
    const [editTodoId, setEditTodoId] = useState(null)
    const [streak, setStreak] = useState(0)

    //sounds
    const [addTodoSound] = useSound(add)
    const [errorSound] = useSound(error)
    const [clearSound] = useSound(clear)
    const [logoutSound] = useSound(logout)
    const [completeSound] = useSound(complete)

    const fetchUsername = () => {
        try {
            const token = localStorage.getItem("token")
            const user = jwtDecode(token)
            setUsername(user.username)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchUsername()
    }, [])


    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/todo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setTodos(response.data.todos);
                setStreak(response.data.streak || 0);
            } else {
                setError("Failed to fetch todos.");
            }
        } catch (err) {
            enqueueSnackbar("Something is up with the server!", { variant: "error" })
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleClearAll = async () => {
        try {
            const token = localStorage.getItem("token");
            const clearAll = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/todo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (clearAll.status == 200) {
                clearSound()
                setTodos([])
                setNewTodo("")
                enqueueSnackbar("All todos cleared!", { variant: "success" })
            }
        } catch (err) {
            errorSound()
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleTodoSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            //by Default the todo will be uncompleted so we are sending the completed as false status to our backend
            const postTodo = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/todo`, { title: newTodo, completed: false }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (postTodo.status === 200) {
                addTodoSound()
                enqueueSnackbar("New activity added! Keep the streak going!", { variant: 'success' })
                setNewTodo("");
                setTodos(prev => [postTodo.data.newTodo, ...prev])
                setStreak(postTodo.data.streak)
            }
        } catch (error) {
            errorSound()
            enqueueSnackbar("Something is up with the server!", { variant: "error" })
            setError(error.message);
        }
    };

    const handleCompletedStatus = async (todo) => {
        try {
            const token = localStorage.getItem("token");
            const markedCompleted = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/todo/${todo?._id}`, { completed: !todo.completed }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (markedCompleted.status === 200) {
                completeSound()
                setTodos(prev => prev.map(item =>
                    item._id === todo._id ? { ...item, completed: !item.completed } : item
                ))
                console.log(todos)
                enqueueSnackbar("Todo marked as completed", { variant: 'success' })
            }
        } catch (error) {
            errorSound()
            setError(error.message);
        }
    };
    //added the delete functionality here! after version 1.1.0
    const deleteTodo = async (id) => {

        try {
            const token = localStorage.getItem("token")
            const todo = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/todo/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (todo.status == 200) {
                setTodos(prev => prev.filter(todo => todo._id !== id))
                enqueueSnackbar("Todo deleted!", { variant: "success" })
            }

        } catch (err) {
            errorSound()
            setError(err.messgae)
        }
    }

    // handle todo edit functionality - Start Editing
    const handleTodoEdit = (e, todo) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent the parent div's onClick from firing
        setIsTodoEditing(true);
        setEditTodoId(todo._id);
        setNewTodo(todo.title);
    }

    // Handle Update Todo - Save Changes
    const handleUpdateTodo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            const updateTodo = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/todo/${editTodoId}`, { title: newTodo }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (updateTodo.status === 200) {
                setTodos(prev => prev.map(item => item._id === editTodoId ? { ...item, title: newTodo } : item))
                completeSound()
                enqueueSnackbar("Todo updated successfully!", { variant: 'success' })
                setIsTodoEditing(false);
                setEditTodoId(null);
                setNewTodo("");
            }
        } catch (error) {
            errorSound()
            enqueueSnackbar("Failed to update todo", { variant: "error" })
        }
    }

    const handleLogout = () => {
        // Play sound and show notification first
        logoutSound()
        enqueueSnackbar("Logged out successfully!", { variant: "success" })

        // Clear token
        localStorage.removeItem("token");

        // Navigate to home page after a short delay to allow sound/notification to execute
        setTimeout(() => {
            navigate('/');
        }, 300);
    };


    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 font-mono min-h-screen">
            <div className="col-span-2 h-[17rem]  sm:relative flex flex-col items-center bg-darkBg sm:h-screen">
                <div
                    onMouseEnter={() => setMoveNinja(true)}
                    onMouseLeave={() => setMoveNinja(false)}
                    className="bg-darkPrimary absolute top-36 md:top-60 lg:top-64 p-4 text-lg md:text-xl lg:text-2xl rounded-xl hover:bg-gradient-to-tr hover:from-blue-300 hover:to-pink-300 transition-transform duration-500"
                >
                    <FaUserNinja className={`${moveNinja ? "translate-x-16" : "translate-x-0"} transition-transform duration-300`} />
                    {username}
                </div>
                <div className="text-orange-300 absolute top-10 md:top-20 text-[3rem] md:text-[4rem] lg:text-[6rem]">📝</div>
                <div className="absolute top-4 left-4 text-xl sm:hidden text-white">
                    🔥 Streak: {streak}
                </div>
            </div>

            <div className="col-span-3 min-h-screen flex flex-col items-center bg-lightBorderColor w-full">
                <div className="flex justify-between w-full mt-4 px-4 md:pr-2">
                    <div className="text-2xl font-bold text-black hidden sm:block">
                        🔥 Streak: {streak}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="border-2 px-4 py-2 text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-300 rounded-xl"
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={!isTodoEditing ? handleTodoSubmit : (e) => handleUpdateTodo(e)} className="flex flex-col items-center gap-4 w-full max-w-xs md:max-w-sm mt-6 md:mt-10 px-4">
                    <Input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder={isTodoEditing ? "Update your todo..." : "Enter new todo..."}
                        required
                        className="w-full"
                    />
                    <div className='flex gap-3'>
                        <button
                            type="submit"
                            className="border-2 px-4 py-2 text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-500 rounded-xl"
                        >
                            {isTodoEditing ? "Update Todo" : "Add Todo"}
                        </button>
                        <button
                            type="submit"
                            onClick={handleClearAll}
                            className="border-2 px-4 py-2 text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-500 rounded-xl"
                        >
                            Clear All
                        </button>
                    </div>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <div className="w-full max-w-xs md:max-w-sm mt-6 px-4">
                    {loading ? (
                        <div className="text-center text-black hover:text-darkPrimary">Loading...</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {todos && todos.length > 0 ? (
                                todos.map((todo) => (
                                    <div className='relative'>
                                        <div
                                            key={todo?._id}
                                            className="cursor-pointer  flex items-center gap-2 border-2 border-gray-400 text-black hover:bg-lightPrimary hover:text-darkPrimary transition-all duration-300 rounded-xl w-full p-2"

                                        >
                                            <p className={`text-lg w-[80%] flex-1 text-left break-words ${todo.completed ? "line-through text-gray-500" : "text-gray-800"} hover:text-darkPrimary`}
                                                onClick={() => handleCompletedStatus(todo)}
                                            >
                                                {todo?.title}

                                            </p>
                                            <button
                                                onClick={(e) => handleTodoEdit(e, todo)}
                                                className="flex-shrink-0">
                                                <FiEdit />
                                            </button>
                                        </div>
                                        <AiFillDelete className='absolute bottom-3 transition-transform  duration-300 hover:rotate-180 left-[18.5rem] text-2xl md:left-[22.5rem]' onClick={() => deleteTodo(todo?._id)} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No todos available</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Todo;
