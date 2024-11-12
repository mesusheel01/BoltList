import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from './Input';
import {TbPointFilled} from 'react-icons/tb'
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
import { FaUserNinja } from 'react-icons/fa';
import { AiFillDelete } from "react-icons/ai";


const Todo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const {enqueueSnackbar} = useSnackbar()
    const [username, setUsername] = useState('')
    const [moveNinja, setMoveNinja] = useState(false)

    const fetchUsername = ()=>{
        try{
            const token = localStorage.getItem("token")
            const user = jwtDecode(token)
            setUsername(user.username)
        }catch(err){
            setError(err.message)
        }
    }

useEffect(()=>{
    fetchUsername()
},[])


    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('https://bolt-list-server.vercel.app/todo/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setTodos(response.data.todos);
            } else {
                setError("Failed to fetch todos.");
            }
        } catch (err) {
            enqueueSnackbar("Something is up with the server!", {variant:"error"})
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleTodoSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            //by Default the todo will be uncompleted so we are sending the completed as false status to our backend
            const postTodo = await axios.post('https://bolt-list-server.vercel.app/todo/', { title: newTodo, completed: false }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (postTodo.status === 200) {
                enqueueSnackbar("Yeah! New activity is added!",{variant: 'success'})
                setNewTodo("");
                fetchTodos();
            }
        } catch (error) {
            enqueueSnackbar("Something is up with the server!", {variant: "error"})
            setError(error.message);
        }
    };

    const handleCompletedStatus = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const markedCompleted = await axios.put(`https://bolt-list-server.vercel.app/todo/${id}`, { completed: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (markedCompleted.status === 200) {
                fetchTodos();
                enqueueSnackbar("Todo marked as completed",{variant:'success'})
            }
        } catch (error) {
            setError(error.message);
        }
    };
    //added the delete functionality here! after version 1.1.0
    const deleteTodo = async(id)=>{

        try{
            const token = localStorage.getItem("token")
            const todo = await axios.delete(`https://bolt-list-server.vercel.app/todo/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(todo.status == 200){
                fetchTodos()
                enqueueSnackbar("Todo deleted!", {variant:"success"})
            }

        }catch(err){
            setError(err.messgae)
        }
    }

    const handleLogout = async () => {
        localStorage.removeItem("token");
        window.location.href = 'https://bolt-list.vercel.app';
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
        </div>

        <div className="col-span-3  flex flex-col items-center bg-lightBorderColor h-screen w-full">
            <div className="flex justify-end w-full mt-4 pr-4 md:pr-2">
                <button
                    onClick={() => {
                        enqueueSnackbar("Logged out successfully!", { variant: 'success' });
                        handleLogout();
                    }}
                    className="border-2 px-4 py-2 text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-300 rounded-xl"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={handleTodoSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs md:max-w-sm mt-6 md:mt-10 px-4">
                <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo..."
                    required
                    className="w-full"
                />
                <button
                    type="submit"
                    className="w-full md:w-[14rem] lg:w-full border-2 px-4 py-2 text-lightPrimary border-gray-400 hover:bg-lightPrimary hover:text-lightBorderColor transition-all duration-500 rounded-xl"
                >
                    Add Todo
                </button>
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
                                    className="cursor-pointer border-2 text-center border-gray-400 text-black hover:bg-lightPrimary hover:text-darkPrimary transition-all duration-300 rounded-xl w-full p-2"
                                    onClick={() => handleCompletedStatus(todo?._id)}
                                >
                                    <div className="flex items-center justify-start gap-2">
                                        <TbPointFilled />
                                        <p className={`text-lg ${todo.completed ? "line-through text-gray-500" : "text-gray-800"} hover:text-darkPrimary`}>
                                            {todo?.title}
                                        </p>
                                    </div>
                                </div>
                                        <AiFillDelete className='absolute bottom-3 transition-transform  duration-300 hover:rotate-180 left-[18.5rem] text-2xl md:left-[22.5rem]' onClick={()=>deleteTodo(todo?._id)} />
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
